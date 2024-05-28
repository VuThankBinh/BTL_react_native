/**
 * @format
 */

import { name as appName } from './app.json';
import React, { useState, useEffect,useRef } from 'react';
import { View, Text, Image, FlatList, AppRegistry, Animated, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Header, Icon, Card, Button } from 'react-native-elements';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ipV4 } from './app.json'

const Stack = createStackNavigator();

const DetailsScreen = ({ navigation, route }) => {
    const { id } = route.params;
    const [product, setProduct] = useState('');
    const [sptt, setSPTT] = useState('');
    var [mainImage, setMainImage] = useState('');
    const [loading, setLoading] = useState(true);
    useEffect(() => { GetSP(); }, ['']);
    useEffect(() => { ; Getsptt(); }, []);
    const scrollRef = useRef(null);
    const handleProductClick = (newProductId) => {
        // Cập nhật route params với id của sản phẩm mới
        navigation.setParams({ id: newProductId });
    
        // Gọi lại hàm GetSP để lấy thông tin sản phẩm mới
        GetSP(newProductId);
        
         // Cuộn lên đầu trang
    };
    const GetSP = async (newProductId) => {
        try {
            if(newProductId==null)
                newProductId=id;
            const response = await fetch(ipV4 + `:3000/sanphams/${newProductId}`);
            const data = await response.json();
            setProduct(data);
            setMainImage(data.anh_dai_dien);
            // console.log(data);
            setLoading(false);
            Getsptt();
            scrollRef.current.scrollTo({ y: 0, animated: true });
        } catch (error) {
            console.error('Error fetching products: ', error);
            setLoading(false);
        }
    };
    const Getsptt = async () => {
        try {
            const response = await fetch(ipV4 + `:3000/sanphamtuongtu/${id}`);
            const data = await response.json();
            setSPTT(data);
            // setMainImage(data.anh_dai_dien);
            // console.log(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products: ', error);
            setLoading(false);
        }
    };
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => {
        if (quantity < 10) {
            setQuantity(quantity + 1);
        }
    };

    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const thumbnails = product.hinh_anh;
    const addToCart = async (item) => {
        try {
            let cartItems = await AsyncStorage.getItem('cartItems');
            cartItems = cartItems ? JSON.parse(cartItems) : [];

            const index = cartItems.findIndex(cartItem => cartItem.id === id);
            if (index > -1) {
                cartItems[index].quantity += 1;
            } else {
                item.quantity = 1;
                cartItems.push(item);
            }

            await AsyncStorage.setItem('cartItems', JSON.stringify(cartItems));
            alert('Thêm vào giỏ hàng thành công');
            // handleCartChange();
        } catch (error) {
            console.error('Error adding to cart: ', error);
        }
    };
    const [viewHeight, setViewHeight] = useState('auto');
    const [maxHeight, setMaxHeight] = useState(0);

    const handleShowMore = () => {
        console.log('max height:' + maxHeight + "view height: " + viewHeight);
        if (viewHeight + 200 < maxHeight) {
            setViewHeight(viewHeight + 200);
        } else {
            setViewHeight('auto');
        }
    };

    const handleShowLess = () => {
        console.log('max height:' + maxHeight + "view height: " + viewHeight);
        setViewHeight(200); // Đặt lại chiều cao về giá trị ban đầu
    };
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles4.product} onPress={() => handleProductClick(item.id)}>
            <View >
                <Image source={{ uri: ipV4 + '/img/' + item.anh_dai_dien }} style={styles4.productImage} />
                <Card.Divider />
                <Text style={styles4.productName} numberOfLines={1}>{item.ten_sp.length > 20 ? item.ten_sp.slice(0, 20) + '...' : item.ten_sp}</Text>
                <View style={styles4.priceContainer}>
                    <Text style={styles4.price}>{formatPrice(item.gia_ban)}</Text>
                </View>
                {/* <TouchableOpacity style={styles4.redButton} >
                    <Text style={styles4.buttonText}>Thêm vào giỏ</Text>
                </TouchableOpacity> */}
            </View>
        </TouchableOpacity>
    );

    return (

        <ScrollView style={styles4.container} ref={scrollRef}>
            <Image source={{ uri: ipV4 + '/img/' + mainImage }} style={styles4.mainImage} />
            <ScrollView horizontal={true} style={styles4.thumbnailsContainer} showsHorizontalScrollIndicator={false}>
                {thumbnails && thumbnails.map((thumbnail, index) => (
                    <TouchableOpacity key={index} onPress={() => setMainImage(thumbnail)}>
                        <Image source={{ uri: ipV4 + '/img/' + thumbnail }} style={styles4.thumbnail} />
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <Text style={styles4.productTitle}>{product.ten_sp}</Text>
            <Text style={styles4.productPrice}>{formatPrice(product.gia)}<Text style={styles4.oldPrice}>{formatPrice(product.gia_ban)}</Text></Text>
            <Text style={{ marginTop: 20, fontSize: 18, color: 'black' }}>Còn: <Text style={{ fontWeight: 'bold' }}>{product.soluong}</Text></Text>
            <View style={styles4.quantityContainer}>
                <Text style={styles4.quantityText}>Số lượng</Text>
                <View style={styles4.quantityControl}>
                    <TouchableOpacity onPress={decreaseQuantity} style={styles4.quantityButton}>
                        <Text style={styles4.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles4.quantityValue}>{quantity}</Text>
                    <TouchableOpacity onPress={increaseQuantity} style={styles4.quantityButton}>
                        <Text style={styles4.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles4.addToCartButton} onPress={() => addToCart({ id: product.id, name: product.ten_sp, price: product.gia, quantity: quantity, image: product.anh_dai_dien })}>
                <Text style={styles4.addToCartText}>THÊM VÀO GIỎ</Text>
            </TouchableOpacity>
            <Image source={{ uri: ipV4 + '/img/camket.jpg' }} style={{ width: '100%', height: 245, marginTop: 20, backgroundColor: '#fff' }}></Image>
            <Text style={{ color: 'black', fontSize: 22, fontWeight: 'condensed', marginTop: 15, marginLeft: 5, }}>Mô tả sản phẩm 🔥</Text>
            <View
                style={[styles4.expandableView, { height: viewHeight }]} // Initially, set height to 'auto'
                onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    if (maxHeight == 0) {
                        setMaxHeight(height);
                        setViewHeight(200); // Temporarily set to auto to measure height
                        console.log('Measured height:', height);
                    }
                }}
            >
                <Text style={styles4.text2}>‐ Tên sản phẩm: {product.ten_sp}</Text>
                <Text style={styles4.text2}>‐ Mã sản phẩm: SPILTT0{product.id}</Text>
                <Text style={styles4.text2}>‐ Size: free</Text>
                <Text style={styles4.text2}>‐ Chất liệu: Cói</Text>
                <Text style={styles4.text2}>‐ Form chuẩn đẹp, nhẹ nhàng, không gây nặng đầu</Text>
                {thumbnails && thumbnails.map((thumbnail, index) => (
                    <Image key={index} source={{ uri: ipV4 + '/img/' + thumbnail }} style={{ width: "100%", height: 400, marginTop: 10 }} />
                ))}

                <Text style={{ color: 'black', fontSize: 25, marginTop: 10, }}>Cam kết & bảo hành của shop Khăn Phụ Kiện:</Text>
                <Text style={styles4.text2}>‐ Thương hiệu SINCE 2015</Text>
                <Text style={styles4.text2}>‐ Hàng loại 1 - Chất lượng cao cấp</Text>
                <Text style={styles4.text2}>‐ Đổi hàng 30 ngày không cần lý do</Text>
                <Text style={styles4.text2}>‐ Freeship</Text>
                <Text style={styles4.text2}>‐ Nhận hàng trong 30 phút ở Tp.HCM</Text>
                <Text style={styles4.text2}>‐ Kiểm hàng trước khi thanh toán</Text>
                <Image source={{ uri: 'https://product.hstatic.net/1000111569/product/4fc8201370e88fb6d6f9_1d4282ff269b4f07a9a2e4817dedc643_large.jpg' }} style={{ width: '80%', marginTop: 10, alignSelf: 'center', height: 500, }}></Image>

                <Text style={styles4.text2}>
                    Mô tả: {product.mo_ta}
                </Text>

            </View>
            {maxHeight !== 0 && (
                <Button style={{ margin: 10, backgroundColor: 'black' }}
                    title={viewHeight < maxHeight ? "Show More" : "Show Less"}
                    onPress={viewHeight < maxHeight ? handleShowMore : handleShowLess}
                />
            )}
            <Text style={{ color: 'black', fontSize: 22, fontWeight: 'condensed', marginTop: 15, marginLeft: 5, }}>Sản phẩm tương tự 🔥</Text>
            <FlatList
                horizontal
                data={sptt}
                keyExtractor={(item) => item.id.toString()} // Đảm bảo item.id là một giá trị có thể chuyển đổi thành chuỗi
                renderItem={renderItem} // Đảm bảo bạn đã định nghĩa hàm renderItem trước đó và sử dụng dữ liệu từ sptt
                showsHorizontalScrollIndicator={false}
            />



            <View style={styles4.container3}>
                <View style={styles4.section}>
                    <Text style={styles4.sectionHeader}>Khăn Phụ Kiện</Text>
                    <Text style={styles4.text}>CÔNG TY TNHH HILA VIỆT NAM</Text>
                    <Text style={styles4.text}>Ngày ĐK: 16/04/2018</Text>
                    <Text style={styles4.text}>Mã Số Thuế: 0314987556</Text>
                    <Text style={styles4.text}>Số ĐKKD: 41P8018868</Text>
                    <Text style={styles4.text}>Ngày cấp: 12/09/2017</Text>
                    <Text style={styles4.text}>Phòng đăng ký kinh doanh Sở Kế Hoạch Đầu Tư TPHCM</Text>
                    <Text style={styles4.text}>Hotline: 0909.25.15.00</Text>
                </View>

                <View style={styles4.section}>
                    <Text style={styles4.sectionHeader}>HỆ THỐNG CỬA HÀNG</Text>
                    <View style={styles4.addressContainer}>
                        <Image source={require('./gps.png')} style={styles4.icon} />
                        <Text style={styles4.text}>
                            82 Hồ Biểu Chánh, Phường 11, Quận Phú Nhuận, Tp Hồ Chí Minh
                        </Text>
                    </View>
                </View>

                <View style={styles4.section}>
                    <Text style={styles4.sectionHeader}>THÔNG TIN HỖ TRỢ</Text>
                    <Text style={styles4.text}>Thanh Toán</Text>
                    <Text style={styles4.text}>Chính Sách Giao Nhận</Text>
                    <Text style={styles4.text}>Đổi Trả & Bảo Hành</Text>
                    <Text style={styles4.text}>Chính Sách Bảo Mật</Text>
                    <Text style={styles4.text}>Khách Hàng Thân Thiết</Text>
                </View>

                <View style={styles4.section}>
                    <Text style={styles4.sectionHeader}>KẾT NỐI VỚI CHÚNG TÔI</Text>
                    <Text style={styles4.text}>Hãy kết nối với chúng tôi.</Text>
                    <View style={styles4.socialMediaContainer}>
                        <Image source={require('./facebook1.png')} style={styles4.icon} />
                        <Image source={require('./youtube1.png')} style={styles4.icon} />
                        <Image source={require('./instagram1.png')} style={styles4.icon} />
                        {/* <FontAwesome name="facebook" size={24} color="white" style={styles4.icon} />
                        <FontAwesome name="instagram" size={24} color="white" style={styles4.icon} />
                        <FontAwesome name="youtube" size={24} color="white" style={styles4.icon} /> */}
                    </View>
                </View>
                <Image
                    style={styles4.footerImage}
                    source={{ uri: ipV4 + '/img/' + 'dkbocongthuong.png' }} // Replace with your image URL
                />
                <View style={styles4.footer}>

                    <Text style={styles4.footerText}>Một sản phẩm của Vũ Thanh Bình</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles4 = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    expandableView: {
        overflow: 'hidden',
    },
    image1: {
        width: '100%',
        height: 200,
    },
    text2: {
        marginTop: 10,
        fontSize: 16,
        color: 'black'
    },
    mainImage: {
        width: '100%',
        height: 400,
        // resizeMode: 'cover',
        // borderRadius: 10,
    },
    thumbnailsContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    thumbnail: {
        width: 100,
        height: 100,
        // borderRadius: 10,
        resizeMode: 'cover',
        marginLeft: 10,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: 'black',
    },
    productPrice: {
        fontSize: 20,
        color: '#E91E63',
    },
    oldPrice: {
        textDecorationLine: 'line-through',
        color: '#aaa',
        fontSize: 16,
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    quantityText: {
        fontSize: 16,
        marginRight: 10,
        color: 'black',
    },
    quantityControl: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        // borderRadius: 15,
        borderColor: 'gray',
        borderWidth: 1,
    },
    quantityButtonText: {
        fontSize: 18,
        color: 'black',

    },
    quantityValue: {
        // marginHorizontal: 10,
        fontSize: 16,
        color: 'black',
        borderColor: 'gray',
        borderWidth: 1,
        paddingVertical: 3,
        paddingHorizontal: 8,
    },
    addToCartButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    addToCartText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    commitmentText: {
        marginTop: 20,
        fontSize: 16,
        color: '#FF9800',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    container3: {
        flex: 1,
        backgroundColor: '#000',
        padding: 16,
        marginTop: 10,
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
    product: {
        // marginHorizontal: 10,
        marginLeft:20,
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius:10,
    },
    productName: {
        marginTop: 5,
        fontSize: 16,
        color:'black'
    },
    priceContainer: {
        marginTop: 5,
    },
    price: {
        fontSize: 14,
        color: 'red',
    },
});
export default DetailsScreen;
AppRegistry.registerComponent(appName, () => DetailsScreen);