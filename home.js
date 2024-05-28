/**
 * @format
 */

import { name as appName } from './app.json';
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, FlatList, AppRegistry, Animated, ScrollView, TouchableOpacity } from 'react-native';
import { Header, Icon, Card, Button } from 'react-native-elements';
import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from './DetailProduct';
import {ipV4} from './app.json'
const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
    
    const slideImages = [
        { uri: ipV4 + '/img/slide_index_1.jpg' },
        { uri: ipV4 + '/img/slideshow1.jpg' }
    ];
   
    const [products1, setProducts1] = useState([]);
    const [products2, setProducts2] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => { GetMu(); GetKhan() }, []);
    const GetMu = async () => {
        try {
            const response = await fetch(ipV4 + `:3000/sanphams/loai/2?pageNumber=1&pageSize=4`);
            const data = await response.json(); 
            setProducts1(data);
            // console.log(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products: ', error);
            setLoading(false);
        }
    };
    const GetKhan = async () => {
        try {
            const response = await fetch(ipV4 + `:3000/sanphams/loai/3?pageNumber=1&pageSize=4`);
            const data = await response.json();
            setProducts2(data);
            // console.log(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products: ', error);
            setLoading(false);
        }
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };



    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles2.product} onPress={() => navigation.navigate('Details', { id: item.id })}>
            <View >
                <View style={styles2.discountBadge}>
                    <Text style={styles2.discountText}>-{((item.gia_ban - item.gia) / item.gia_ban * 100).toFixed(0)}%</Text>
                </View>
                <Image source={{ uri: ipV4 + '/img/' + item.anh_dai_dien }} style={styles2.productImage} />
                <Card.Divider />
                <Text style={styles2.productName} numberOfLines={1}>{item.ten_sp.length > 30 ? item.ten_sp.slice(0, 25) + '...' : item.ten_sp}</Text>
                <View style={styles2.priceContainer}>
                    <Text style={styles2.price}>{formatPrice(item.gia)}</Text>
                    <Text style={styles2.originalPrice}>{formatPrice(item.gia_ban)}</Text>
                </View>
                {/* <TouchableOpacity style={styles2.redButton} >
                    <Text style={styles2.buttonText}>Thêm vào giỏ</Text>
                </TouchableOpacity> */}
            </View>
        </TouchableOpacity>
    );
    return (
        <ScrollView style={styles2.container}>
            <View style={styles2.bannerContainer}>
                <Animated.Image
                    source={slideImages[0]}
                    style={[styles2.bannerImage, { opacity: 1 }]}
                />
            </View>
            {/* <Text style={styles2.bannerText}>Sản phẩm hot</Text>
            <View style={styles2.separatorContainer}>
                <View style={styles2.separator} />
                <Image
                    source={require('./star.png')} // Thay đổi đường dẫn đến hình ảnh của bạn
                    style={styles2.starImage}
                />
                <View style={styles2.separator} />
            </View> */}
            <Text style={styles2.bannerText}>Mũ nón đẹp: Mũ cói vành, Mũ Bucket</Text>
            <View style={styles2.separatorContainer}>
                <View style={styles2.separator} />
                <Image
                    source={require('./star.png')} // Thay đổi đường dẫn đến hình ảnh của bạn
                    style={styles2.starImage}
                />
                <View style={styles2.separator} />
            </View>
            <FlatList
                data={products1}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={{ alignItems: 'flex-start' }}
            />
            <Text style={styles2.signupText}>
                Mời bạn xem thêm các mẫu: Mũ Bucket, Nón Đi Biển, Mũ Đẹp...{' '}
                <Text style={styles2.signupLink}>khác</Text>
            </Text>
            <Text style={styles2.bannerText}>Khăn choàng cổ thời trang nữ đẹp</Text>
            <View style={styles2.separatorContainer}>
                <View style={styles2.separator} />
                <Image
                    source={require('./star.png')} // Thay đổi đường dẫn đến hình ảnh của bạn
                    style={styles2.starImage}
                />
                <View style={styles2.separator} />
            </View>
            <FlatList
                data={products2}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                scrollEnabled={false}
                contentContainerStyle={{ alignItems: 'flex-start' }}
            />
            <Text style={styles2.signupText}>
                Mời bạn xem thêm các mẫu: Khăn choàng cổ...{' '}
                <Text style={styles2.signupLink}>khác</Text>
            </Text>
            <View style={styles2.container1}>
                <View style={styles2.headerContainer}>
                    <View style={styles2.line} />
                    <Text style={styles2.header}>TIN TỨC</Text>
                    <View style={styles2.line} />
                </View>
                <Text style={styles2.subHeader}>Tin tức được cập nhật thường xuyên</Text>
                <View style={styles2.newsContainer}>
                    <View style={styles2.newsItem}>
                        <Image
                            style={styles2.imagePlaceholder}
                            source={{ uri: ipV4 + '/img/' + 'tin1.png' }} // Replace with your image URL
                        />
                        <Text style={styles2.title}>Mũ nón cói đẹp - Giá tốt - Xu hướng mới nhất năm 2024</Text>
                        <Text style={styles2.date}>25/05/2024 lúc 20:45PM</Text>
                    </View>
                    <View style={[styles2.newsItem, { marginLeft: 10, }]}>
                        <Image
                            style={styles2.imagePlaceholder}
                            source={{ uri: ipV4 + '/img/' + 'tin2.png' }} // Replace with your image URL
                        />
                        <Text style={styles2.title}>Khăn lụa vuông vật bất ly thân của mọi cô nàng</Text>
                        <Text style={styles2.date}>24/05/2024 lúc 11:18AM</Text>
                        <Text style={styles2.description}>
                            "Bỏ túi" ngay bí kíp biến hóa phong cách thần sầu với chiếc khăn lụa vuông...
                        </Text>
                    </View>
                </View>
                <TouchableOpacity style={styles2.button}>
                    <Text style={styles2.buttonText}>Xem thêm các bài viết khác</Text>
                </TouchableOpacity>

            </View>
            <View style={styles2.container3}>
                <View style={styles2.section}>
                    <Text style={styles2.sectionHeader}>Khăn Phụ Kiện</Text>
                    <Text style={styles2.text}>CÔNG TY TNHH HILA VIỆT NAM</Text>
                    <Text style={styles2.text}>Ngày ĐK: 16/04/2018</Text>
                    <Text style={styles2.text}>Mã Số Thuế: 0314987556</Text>
                    <Text style={styles2.text}>Số ĐKKD: 41P8018868</Text>
                    <Text style={styles2.text}>Ngày cấp: 12/09/2017</Text>
                    <Text style={styles2.text}>Phòng đăng ký kinh doanh Sở Kế Hoạch Đầu Tư TPHCM</Text>
                    <Text style={styles2.text}>Hotline: 0909.25.15.00</Text>
                </View>

                <View style={styles2.section}>
                    <Text style={styles2.sectionHeader}>HỆ THỐNG CỬA HÀNG</Text>
                    <View style={styles2.addressContainer}>
                        <Image source={require('./gps.png')} style={styles2.icon} />
                        <Text style={styles2.text}>
                            82 Hồ Biểu Chánh, Phường 11, Quận Phú Nhuận, Tp Hồ Chí Minh
                        </Text>
                    </View>
                </View>

                <View style={styles2.section}>
                    <Text style={styles2.sectionHeader}>THÔNG TIN HỖ TRỢ</Text>
                    <Text style={styles2.text}>Thanh Toán</Text>
                    <Text style={styles2.text}>Chính Sách Giao Nhận</Text>
                    <Text style={styles2.text}>Đổi Trả & Bảo Hành</Text>
                    <Text style={styles2.text}>Chính Sách Bảo Mật</Text>
                    <Text style={styles2.text}>Khách Hàng Thân Thiết</Text>
                </View>

                <View style={styles2.section}>
                    <Text style={styles2.sectionHeader}>KẾT NỐI VỚI CHÚNG TÔI</Text>
                    <Text style={styles2.text}>Hãy kết nối với chúng tôi.</Text>
                    <View style={styles2.socialMediaContainer}>
                        <Image source={require('./facebook1.png')} style={styles2.icon} />
                        <Image source={require('./youtube1.png')} style={styles2.icon} />
                        <Image source={require('./instagram1.png')} style={styles2.icon} />
                        {/* <FontAwesome name="facebook" size={24} color="white" style={styles2.icon} />
                        <FontAwesome name="instagram" size={24} color="white" style={styles2.icon} />
                        <FontAwesome name="youtube" size={24} color="white" style={styles2.icon} /> */}
                    </View>
                </View>
                <Image
                    style={styles2.footerImage}
                    source={{ uri: ipV4 + '/img/' + 'dkbocongthuong.png' }} // Replace with your image URL
                />
                <View style={styles2.footer}>

                    <Text style={styles2.footerText}>Một sản phẩm của Vũ Thanh Bình</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const HomeStack = () => (
    <Stack.Navigator initialRouteName="TrangChu">
        <Stack.Screen name="TrangChu" component={HomeScreen} options={{ title: '', headerShown: false, }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: '', headerShown: false, }} />
    </Stack.Navigator>
);
const styles2 = StyleSheet.create({
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

export default HomeStack;
AppRegistry.registerComponent(appName, () => HomeStack);