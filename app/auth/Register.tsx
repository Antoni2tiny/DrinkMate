import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { colors, sizes } from '../../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';



export default function Register() {


const navigation = useNavigation(); 
interface IFormvalues{
    nombre: string
    apellido: string
    email: string
    password: string
}

const FormValidationSchema =Yup.object().shape({
        nombre: Yup.string().required("Ingresa tu Nombre"),
        apellido: Yup.string().required("Ingresa tu Apellido"),
        email: Yup.string().email("Email no tiene la forma adecuada").required('email es requerido'),
        password: Yup.string().min(4,'la contraseña debe tener al menos 4 caracteres').required('contraseña es requerido')
    })

const handleRegister = (values: IFormvalues) => {
    console.log(values);
    navigation.navigate('Login')
    }


return (
    <Formik initialValues={{ nombre:'' , apellido:'', email: '', password: '' }}
    validationSchema={FormValidationSchema} 
    validationOnMount={true}
    onSubmit={handleRegister} >
        {({values, handleChange, handleSubmit, errors,isValid})=>(
             <SafeAreaView style={styles.container}>
            <Text style={styles.title2}>Registrarme en:</Text>
                <SafeAreaView style={styles.box}>
                                <Entypo style={styles.title} name="drink" size={15} />
                                <Text style={styles.title}> DrinkGo</Text>
                            </SafeAreaView>
            <TextInput
                style={styles.input}
                placeholder="Nombre"
                value={values.nombre}
                onChangeText={handleChange("nombre")}
            />
            {errors && <Text style={styles.error}>{errors.nombre}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Apellido"
                value={values.apellido}
                onChangeText={handleChange("apellido")}
            />
            {errors && <Text style={styles.error}>{errors.apellido}</Text>}
            <TextInput
                style={styles.input}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                value={values.email}
                onChangeText={handleChange("email")}
            />
            {errors && <Text style={styles.error}>{errors.email}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Password"
                autoCapitalize="none"
                value={values.password}
                onChangeText={handleChange("password")}
            />

            {errors && <Text style={styles.error}>{errors.password}</Text>}

            <Pressable onPress={handleSubmit} disabled={!isValid}>
                <Text style={styles.login }>
                Registrarse
                </Text>
            </Pressable>

        <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={styles.back}>Volver al login</Text>
        </Pressable>

        </SafeAreaView>
        )}

    </Formik>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    title: {
        fontSize: 42,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
        marginBottom: 4,
    },
    title2: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.primary,
        textAlign: 'center',
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
            minWidth: '87%',
            height: 40,
            fontSize: 12,
            color: colors.text,
            paddingHorizontal: 8,
            backgroundColor: colors.background,
            borderRadius: 6,
    },
    login: {
        marginTop: 20,
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 8,
        alignSelf: 'center',
        color: "#fff",
        fontWeight: "bold"
    },
    loginDisabled: {
        marginTop: 16,
        color: colors.accent,
    },
    back: {
        marginTop: 12,
        color: colors.accent,
        textDecorationLine: 'underline',
    },
    error: {
        color: 'red',
        fontSize: 10,
        marginTop: 8,
    },
    box:{
        flexDirection: "row",
        justifyContent:"center",
        alignItems: "center",
        gap: 12
    },
});