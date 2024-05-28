/**
 * @format
 */

import { name as appName } from './app.json';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, StyleSheet, FlatList, AppRegistry, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { Header, Icon, Card, Button } from 'react-native-elements';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DetailsScreen from './DetailProduct';
import { ipV4 } from './app.json'
import HomeStack from "./home";
import Cart from './Cart';
import { useFocusEffect } from '@react-navigation/native';

const Drawer = createDrawerNavigator();
const App = () => {
    const [loaisp1, setloaisp] = useState([]);
    useEffect(() => { getLoaiSP();loadCartItems; }, []);
    const getLoaiSP = async () => {
        try {
            const response = await fetch(ipV4 + `:3000/loaisanpham`);
            const data = await response.json();
            // console.log(data);
            setloaisp(data);
        } catch (error) {
            console.error('Error fetching products: ', error);
        }
    };
    const [itemCount, setItemCount] = useState(0);
    const loadCartItems = async () => {
        try {
            let items = await AsyncStorage.getItem('cartItems');
            items = items ? JSON.parse(items) : [];
            const itemCount1 = items.reduce((total, currentItem) => total + currentItem.quantity, 0);
            setItemCount(itemCount1);
        } catch (error) {
            console.error('Error loading cart items: ', error);
        }
    };

    // useFocusEffect(
    //     useCallback(() => {
    //         loadCartItems();
    //     }, [])
    // );
    const CustomHeader = ({ navigation }) => (
        <Header
            containerStyle={[styles.headerContainer, { backgroundColor: 'white' }]}
            leftComponent={
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Image source={require('./menu.png')} style={{ width: 30, height: 30, marginTop: 25 }} />
                </TouchableOpacity>
            }
            centerComponent={
                <View style={styles.centerContainer}>
                    <Image source={{ uri: ipV4 + '/img/logo.png' }} style={styles.logo} />
                    <Image source={require('./search.png')} style={styles.searchIcon} />
                </View>
            }
            rightComponent={
                <>
                <TouchableOpacity onPress={()=> navigation.navigate('Cart')}>
                <Image source={require('./shopping-cart.png')} style={{ width: 30, height: 30, marginTop: 25 }} />
                    {itemCount >= 0 && (
                        <Text style={{ position: 'absolute', top: 40, right: -7, backgroundColor: 'red', borderRadius: 10, color: 'white', paddingHorizontal: 5, paddingVertical: 1 }}>
                            {itemCount}
                        </Text>
                    )}
                </TouchableOpacity>
                    
                </>
            }
        />
    );
    // useEffect(() => {
    //     const loadCartItems = async () => {
    //         try {
    //             let items = await AsyncStorage.getItem('cartItems');
    //             items = items ? JSON.parse(items) : [];
    //             const itemCount1 = items.reduce((total, currentItem) => total + currentItem.quantity, 0);
    //             setItemCount(itemCount1);
    //         } catch (error) {
    //             console.error('Error loading cart items: ', error);
    //         }
    //     };

    //     loadCartItems();
    // }, [AsyncStorage]);
    return (
        <View style={{ flex: 1 }}>

            <NavigationContainer>
                <Drawer.Navigator
                    initialRouteName="HomeStack">

                    <Drawer.Screen
                        name="HomeStack"
                        component={HomeStack}

                        options={({ navigation }) => ({
                            title: 'Trang chủ',
                            onPress: () => {
                                if (navigation.name == 'Home') {
                                    navigation.navigate('HomeStack', { screen: 'TrangChu' });
                                }
                            },
                            drawerIcon: () => (
                                <Image source={{ uri: ipV4 + '/img/' + 'home.png' }} style={{ width: 30, height: 30, backgroundColor: '#fff' }} />
                            ),
                            header: () => <CustomHeader navigation={navigation} />,
                            // headerShown: true, // Đảm bảo hiển thị header
                        })}
                    />
                    {loaisp1.map((screen, index) => (
                        <Drawer.Screen
                            key={index}
                            name={'L' + screen.MaLoai}
                            component={TimKiem} // Ensure screen.component holds a valid component reference
                            options={({ navigation }) => ({
                                title: screen.TenLoai,
                                drawerIcon: () => (
                                    <Image source={{ uri: ipV4 + '/img/' + screen.HinhAnhMinhHoa }} style={{ width: 30, height: 30 }} />
                                ),
                                header: () => <CustomHeader navigation={navigation} />,
                            })}
                        />
                    ))}
                    <Drawer.Screen name="Cart" options={({ navigation }) => ({
                        title: "Giỏ hàng",

                        header: () => <CustomHeader navigation={navigation} />,
                    })}
                        component={Cart}
                    ></Drawer.Screen>

                </Drawer.Navigator>

            </NavigationContainer>
        </View>
    );
};
const TimKiem = () => { }
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    signupLink: {
        color: 'blue', // Link "Đăng ký" màu xanh
        textDecorationLine: 'underline',
    },
    centerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    signupText: {
        textAlign: 'center',
        marginBottom: 16,
        fontSize: 16,
        color: '#000',
        width: '75%',
        alignSelf: 'center'
    },
    logo: {
        width: 170,
        height: 80,
        resizeMode: 'contain',
    },
    searchIcon: {
        width: 25,
        height: 25,
        marginLeft: 20,
    },
    bannerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: 10,
        marginTop: 20,
    },
    bannerImage: {
        width: '100%',
        height: 170,
    },
    bannerText: {
        width: '100%',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "black",
        marginVertical: 10,
    },
    discountBadge: {
        position: 'absolute',
        top: 20,
        right: -10,
        zIndex: 1000,
        backgroundColor: 'red',
        color: 'red',
        borderRadius: 100, // Sử dụng một giá trị lớn để đảm bảo nó trở thành hình tròn
        paddingBottom: 10,
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 10,
    },
    product: {
        borderRadius: 10,
        position: 'relative',
        width: '45%',
        margin: '2.5%',
        borderColor: '#ddd',
        backgroundColor: '#fff',
        borderWidth: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 5,
        paddingRight: 5
    },
    discountText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#ccc',
        alignSelf: 'center', // Căn giữa hình ảnh
    },
    productName: {
        fontSize: 12,
        color: 'black',

    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    price: {
        color: 'purple',
        fontSize: 16,
        fontWeight: 'bold',
    },
    originalPrice: {
        textDecorationLine: 'line-through',
        marginLeft: 10,
        color: 'grey',
    },
    headerContainer: {
        backgroundColor: 'white', // Thiết lập màu nền thành trắng
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    redButton: {
        backgroundColor: 'red', // Button màu đỏ
        paddingTop: 10,
        paddingBottom: 10,
        width: '60%',
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        alignSelf: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff', // Text màu trắng trên button
        fontSize: 14,
    },
    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    separator: {
        height: 1,
        width: '40%',
        backgroundColor: '#000',
    },
    starImage: {
        width: 20,
        height: 20,
        marginHorizontal: 10,
    }, headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },
    header: {
        fontSize: 24,
        textAlign: 'center',
        marginHorizontal: 10,
        color: 'black'
    },
    line: {
        flex: 1,
        height: 1,
        backgroundColor: '#000',
    },
    subHeader: {
        textAlign: 'center',
        marginBottom: 20,
        color: 'grey',
    },
    newsContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center'

    },
    newsItem: {
        marginBottom: 20,
        width: '45%'
    },
    imagePlaceholder: {
        width: '100%',
        height: 200,
        backgroundColor: '#eee',
        marginRight: 10,
        borderRadius: 5,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: 'gray'
    },
    date: {
        fontSize: 14,
        color: 'grey',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#333',
    },
    button: {
        padding: 15,
        backgroundColor: '#000',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    container1: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
    },
    section: {
        marginBottom: 20,
    },
    container3: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    text: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 5,
    },
    socialMediaContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    icon: {
        marginRight: 15,
        backgroundColor: 'white',
    },
    footer: {
        alignItems: 'center',
        marginTop: 20,
    },
    footerImage: {
        width: 160,
        height: 60,
        marginBottom: 10,
    },
    footerText: {
        color: '#fff',
        fontSize: 12,
    },
    addressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
        // backgroundColor:'white'
    },
});

export default App;
AppRegistry.registerComponent(appName, () => App);
