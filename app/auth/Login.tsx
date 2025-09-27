import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import { colors, sizes } from '../../utils';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigation } from '@react-navigation/native';


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
    }


    return (
    <Formik initialValues={{ email: '', password: '' }} 
    validationSchema={FormValidationSchema}
    validationOnMount={true}
    onSubmit={handleLogin}>
        {({values,handleChange, handleSubmit, errors, isValid})=>(
           <SafeAreaView style={styles.container}>
            <Text style={styles.title}>DrinkMate</Text>
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
                <TouchableOpacity onPress={()=> setShowPass(!showPass)}>
                    <Text style={styles.toggle}>{showPass? 'Ocultar' : 'Mostrar'}</Text>
                </TouchableOpacity>
            </View>
            {errors && <Text style={styles.error}>{errors.password}</Text> }
            <Pressable onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.back}>Registrarme</Text>
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
     title: {
    fontSize: sizes.titulo,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
 
    input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.muted,
    marginTop: 16,
    minWidth: '100%',
    height: 48,
    fontSize: 16,
    color: colors.text,
    paddingHorizontal: 8,
    backgroundColor: colors.background,
  },
   passContainer: {
       flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 8,
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
    },
    back: {
    marginTop: 12,
    color: colors.secondary,
    textDecorationLine: 'underline',
  },
    
    
})