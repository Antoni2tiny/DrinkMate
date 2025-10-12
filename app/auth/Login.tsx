import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { colors, sizes } from '../../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';


export default function Login(){

    const [showPass, setShowPass] = useState<boolean>(true)
    
    const navigation = useNavigation()

    interface IFormvalues{
        email:string
        password: string
    }

    const FormValidationSchema =Yup.object().shape({
        email: Yup.string().email("Email no tiene la forma adecuada").required('email es requerido'),
        password: Yup.string().min(4,'la contraseña debe tener al menos 4 caracteres').required('contraseña es requerido')
    })
    const handleLogin= (values: IFormvalues) =>{ 
        console.log(values);
        navigation.navigate('Main')
    }


    return (
    <Formik initialValues={{ email: '', password: '' }} 
    validationSchema={FormValidationSchema}
    validationOnMount={true}
    onSubmit={handleLogin}>
        {({values,handleChange, handleSubmit, errors, isValid})=>(
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={styles.box}>
                <Entypo style={styles.title} name="drink" size={15} />
                <Text style={styles.title}>DrinkGo</Text>
            </SafeAreaView>
            <TextInput style={styles.input}
            keyboardType={"email-address"}
            placeholder='Email'
            value={values.email}
            autoCapitalize='none'
            keyboardType='email-address'
            onChangeText={handleChange("email")}
            />
            {errors && <Text style={styles.error}>{errors.email}</Text> }
            <View style={styles.passContainer}>
                <TextInput style={styles.input}
                secureTextEntry={!showPass}
                placeholder='Contraseña'
                value={values.password}
                secureTextEntry
                onChangeText={handleChange("password")}
                />
                {/* <TouchableOpacity onPress={()=> setShowPass(!showPass)}>
                    <Text style={styles.toggle}>{showPass? 'Ocultar' : 'Mostrar'}</Text>
                </TouchableOpacity> */}
            </View>
            {errors && <Text style={styles.error}>{errors.password}</Text> }
            <Pressable onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.back}>¿No estas registrado?</Text>
                  </Pressable>
            <Pressable onPress={handleSubmit} disabled={!isValid}>
                <Text style={styles.login}>Iniciar sesion</Text>
            </Pressable>
            
        </SafeAreaView>
    )}

    </Formik>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },
    box:{
        flexDirection: "row",
        justifyContent:"center",
        alignItems: "center",
        gap: 12
    },
    title: {
        fontSize: 46,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: colors.muted,
        elevation: 5, // sombra Android
        shadowColor: '#000', // sombra iOS
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        marginTop: 2,
        minWidth: '100%',
        height: 40,
        fontSize: 12,
        color: colors.text,
        paddingHorizontal: 8,
        backgroundColor: colors.background,
        borderRadius: 6,
    },
    passContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 3,
    },
    
    toggle: {
        color: colors.accent,
        fontSize: 14,
        marginLeft: 8,
    },
    error:{
        color: colors.accent,
        fontSize: 12,
        marginTop: 8,
        textAlign: 'center',
    },
    loginDisabled: {
        marginTop: 24,
        backgroundColor: colors.muted,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignSelf: 'center',
    },
    login: {
        marginTop: 24,
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignSelf: 'center',
        color: "#fff",
        fontWeight: "bold"
    },
    back: {
        marginTop: 12,
        color: colors.accent,
        textDecorationLine: 'underline',
  },
    

})