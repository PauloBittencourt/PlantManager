import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator
} from 'react-native';

import { Load } from '../components/Load'
import { EnvironmentButton } from '../components/EnvironmentButton';
import { Header } from '../components/Header';
import { PlantCardPrimary } from '../components/PlantCardPrimary';
import api from '../services/api';
import fonts from '../styles/fonts';
import colors from './colors';

interface EnvironmentProps {
    key: string;
    title: string;
}

interface Plantprops {
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
        times: number;
        repeat_every: string;
    }
}

export function PlantSelect() {
    const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
    const [plants, setPlants] = useState<Plantprops[]>([]);
    const [filteredPlants, setfilteredPlants] = useState<Plantprops[]>([]);
    const [environmentsSelected, setEnvironmentsSelected] = useState('all');
    const [loading, setLoading] = useState(true);

    const [page, setPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadedAll, setLoadedAll] = useState(false);

    function handleEnvironmentsSelected(environment: string) {
        setEnvironmentsSelected(environment);

        if (environment == 'all')
            return setfilteredPlants(plants);

        const filtered = plants.filter(plant =>
            plant.environments.includes(environment)
        );

        setfilteredPlants(filtered);
    }

    async function fetchPlants() {
        const { data } = await api
            .get(`plants?_sort=name&_order=asc&_page=${page}&_limit=10`);

        if (!data)
            return setLoading(true);

        if (page > 1) {
            setPlants(oldValue => [...oldValue, ...data])
            setfilteredPlants(oldValue => [...oldValue, ...data])
        }
        else {
            setPlants(data);
            setfilteredPlants(data);
        }

        setLoading(false);
        setLoadingMore(false);


    }


    function handleFetchMore(distance: number) {
        if (distance < 1)
            return;

        setLoadingMore(true);
        setPage(oldValue => +1);
        fetchPlants();

    }

    useEffect(() => {
        async function fetchEnvironment() {
            const { data } = await api
                .get('plants_environments?_sort=title&_order=asc');
            setEnvironments([
                {
                    key: 'all',
                    title: 'Todos'
                },
                ...data
            ]);
        }
        fetchEnvironment();
    }, [])

    useEffect(() => {

        fetchPlants();
    }, [])

    if (loading)
        return <Load />

    return (
        <View style={styles.container}>
            <View style={styles.header}>

                <Header />

                <Text style={styles.title}>
                    Em qual ambiante
            </Text>
                <Text style={styles.subtitle}>
                    você quer colocar sua planta ?
            </Text>

            </View>
            <View>
                <FlatList
                    data={environments}
                    renderItem={({ item }) => (
                        <EnvironmentButton
                            title={item.title}
                            active={item.key === environmentsSelected}
                            onPress={() => handleEnvironmentsSelected(item.key)}

                        />

                    )}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.environmentList}
                >

                </FlatList>
            </View>

            <View style={styles.plants}>
                <FlatList
                    data={filteredPlants}
                    renderItem={({ item }) => (
                        <PlantCardPrimary data={item} />
                    )}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    onEndReachedThreshold={0.1}
                    onEndReached={({ distanceFromEnd }) =>
                        handleFetchMore(distanceFromEnd)
                    }
                    ListEmptyComponent={
                        loadingMore 
                        ? <ActivityIndicator color={colors.green} />
                        : <></>
                    }
                />
            </View>


        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        paddingHorizontal: 30
    },
    title: {
        fontSize: 17,
        color: colors.heading,
        fontFamily: fonts.heading,
        lineHeight: 20,
        marginTop: 15
    },
    subtitle: {
        fontFamily: fonts.text,
        fontSize: 17,
        lineHeight: 20,
        color: colors.heading,
    },
    environmentList: {
        height: 40,
        justifyContent: 'center',
        paddingBottom: 5,
        marginLeft: 32,
        marginVertical: 32
    },
    plants: {
        flex: 1,
        padding: 15
    },
})
