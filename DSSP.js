import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from './node_modules/axios/index';
import ProductItem from './ProductItem';
import { name as appName } from './app.json';
import { AppRegistry } from 'react-native';

const numColumns = 3;
const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await fetch('http://192.168.33.128/api/SanPham/get-all');
            // const json = await response.json();
            setProducts(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching data: ', error);
            setLoading(false);
        }
    };
    // useEffect(() => {
    //     axios.get('http://192.168.33.128/api/SanPham/get-all')
    //         .then(response => {
    //             setProducts(response.data);
    //             console.log(response.data);
    //             setLoading(false);
    //         })
    //         .catch(error => {
    //             console.error('Error fetching data:', error);
    //             setLoading(false);
    //         });
    // }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="blue" />
            </View>
        );
    }
    return (
        <FlatList
            data={products}
            renderItem={({ item }) => <ProductItem product={item} />}
            keyExtractor={item => item.id.toString()}
            numColumns={numColumns}
        />
    );
};
const styles = StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
  
  export default ProductList;
  
  AppRegistry.registerComponent(appName, ()=> ProductList);