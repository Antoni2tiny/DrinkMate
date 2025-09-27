import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { colors, sizes } from '../../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';




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
    
    }


return (
    <Formik initialValues={{ nombre:'' , apellido:'', email: '', password: '' }}
    validationSchema={FormValidationSchema} 
    validationOnMount={true}
    onSubmit={handleRegister} >
        {({values, handleChange, handleSubmit, errors,isValid})=>(
             <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Registrarme en DrinkMate</Text>
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
    fontSize: sizes.titulo,
    marginBottom: 20,
    color: colors.primary,
  },
  input: {
    borderBottomWidth: 1,
    marginTop: 10,
    minWidth: 250,
    height: 50,
  },
  login: {
    marginTop: 16,
    color: colors.primary,
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
});