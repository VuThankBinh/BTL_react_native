// import React, { useState, useEffect } from 'react';
// import { name as appName } from './app.json';
// import { AppRegistry, View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import Cart from './Cart';




 


// export default App;
// AppRegistry.registerComponent(appName, () => App);
/**
 * @format
 */

import 'react-native-gesture-handler';
import { AppRegistry, View, Text, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';
import App from './App';
import React, { useState, useEffect } from 'react';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Cart from './Cart';
import login from './Login'
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
const APIurl='http://192.168.207.139';


const ProductDetailScreen = ({ route }) => {
    const { id } = route.params;
    const [product, setProduct] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(APIurl+`:3000/sanphams/${id}`);
            console.log('id:'+id);
            const data = await response.json();
            setProduct(data);
            console.log(data);
            console.log(data.hinh_anh[1]);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products: ', error);
            setLoading(false);
        }
    };
     const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };
    return (
        <View style={styles2.container}>
            <Image source={{ uri:APIurl+ '/img/'+ product.hinh_anh[1] }} style={styles2.image} />
            <View style={styles2.detailsContainer}>
                <Text style={styles2.name}>{product.ten_sp}</Text>
                <Text style={styles2.description}>{product.mo_ta}</Text>
                <Text style={styles2.price}>{formatPrice(product.gia_ban)}</Text>
                <Text style={styles2.price}>{formatPrice(product.gia)}</Text>
            </View>
        </View>
    );
};


const ProductListScreen = ({ navigation,route}) => {
    const { pageNum, pageSize } = route.params;
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch(APIurl+`:3000/sanphams?pageNumber=${pageNum}&pageSize=${pageSize}`);
            const data = await response.json();
            setProducts(data.products);
            // console.log(data.maxPage);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products: ', error);
            setLoading(false);
        }
    };

    const addToCart = async (item) => {
        try {
            let cartItems = await AsyncStorage.getItem('cartItems');
            cartItems = cartItems ? JSON.parse(cartItems) : [];

            const index = cartItems.findIndex(cartItem => cartItem.id === item.id);
            if (index > -1) {
                cartItems[index].quantity += 1;
            } else {
                item.quantity = 1;
                cartItems.push(item);
            }

            await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
            alert('Thêm vào giỏ hàng thành công!');
        } catch (error) {
            console.error('Error adding to cart: ', error);
        }
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate('ProductDetail', { id: item.id })}>
            <View style={styles.itemContainer}>
                <Image source={{ uri:APIurl+ '/img/'+item.anh_dai_dien }} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{item.ten_sp}</Text>
                    <Text style={styles.description}>{item.mo_ta}</Text>
                    <Text style={styles.price}>{formatPrice(item.GiaKM)}</Text>
                </View>
                <TouchableOpacity onPress={() => addToCart(item)}>
                    <Text style={styles.addToCart}>🛒</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <Text onPress={() => navigation.navigate('Cart')} >Giỏ Hàng</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id.toString()}
                />
            )}
        </View>
    );
};

function HomeScreen() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Home Screen</Text>
        </View>
    );
}

function Detail() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'black' }}>Detail Screen</Text>
        </View>
    );
}

const Drawer = createDrawerNavigator();

export default function Test2() {
    return (
        <NavigationContainer>
            {/* <Drawer.Navigator>
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="sp1" component={Detail} />
                <Drawer.Screen name="sp2" component={ProductListScreen} />
            </Drawer.Navigator> */}
            <Stack.Navigator>
                <Stack.Screen name="ProductList" component={ProductListScreen} initialParams={{ pageNum: 1, pageSize: 5 }}/>
                <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
                <Stack.Screen name="Cart" component={Cart} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#ffffff',
        padding: 10,
        borderRadius: 5,
        elevation: 2,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 5,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    description: {
        fontSize: 14,
        marginBottom: 5,
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'green',
    },
    addToCart: {
        fontSize: 30,
        color: 'black',
    },
});
const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 450,
    marginBottom: 20,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'green',
  },
});

AppRegistry.registerComponent(appName, () => login);
