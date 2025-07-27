import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TextInput, Button, Card, Divider, Chip } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useApp } from '../../components/AppContext';

interface UserType {
  id: 'teacher' | 'manager';
  label: string;
  description: string;
  icon: string;
}

const userTypes: UserType[] = [
  {
    id: 'teacher',
    label: 'Professor',
    description: 'Criar atividades, corrigir trabalhos e acompanhar alunos',
    icon: 'school',
  },
  {
    id: 'manager',
    label: 'Gestor',
    description: 'Gerenciar instituição, relatórios e configurações',
    icon: 'admin-panel-settings',
  },
];

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<'teacher' | 'manager' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [step, setStep] = useState<'userType' | 'form'>('userType');
  const { setUserType, setIsAuthenticated, setUser } = useApp();

  const handleUserTypeSelection = (userType: 'teacher' | 'manager') => {
    setSelectedUserType(userType);
    setStep('form');
  };

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!selectedUserType) {
      Alert.alert('Erro', 'Por favor, selecione um tipo de usuário');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simular registro
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setUserType(selectedUserType);
      setIsAuthenticated(true);
      setUser({ name: name, email: email });
      
      if (selectedUserType === 'teacher') {
        router.replace('/');
      } else {
        router.replace('/manager/dashboard');
      }
      
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (error) {
      Alert.alert('Erro', 'Falha no registro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!selectedUserType) {
      Alert.alert('Erro', 'Por favor, selecione um tipo de usuário primeiro');
      return;
    }

    setIsGoogleLoading(true);
    
    try {
      // Simular autenticação Google
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setUserType(selectedUserType);
      setIsAuthenticated(true);
      setUser({ name: 'Usuário Google', email: 'usuario@gmail.com' });
      
      if (selectedUserType === 'teacher') {
        router.replace('/');
      } else {
        router.replace('/manager/dashboard');
      }
      
      Alert.alert('Sucesso', 'Conta criada com Google!');
    } catch (error) {
      Alert.alert('Erro', 'Falha na autenticação Google');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleBackToUserType = () => {
    setStep('userType');
  };

  const handleBackToLogin = () => {
    router.back();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <MaterialIcons name="psychology" size={32} color="white" />
        </View>
        <Text style={styles.logoText}>Vetta</Text>
      </View>
      <Text style={styles.title}>Criar Conta</Text>
      <Text style={styles.subtitle}>
        {step === 'userType' 
          ? 'Escolha o tipo de conta que melhor se adequa ao seu perfil.'
          : 'Preencha seus dados para criar sua conta.'
        }
      </Text>
    </View>
  );

  const renderUserTypeSelection = () => (
    <View style={styles.userTypeContainer}>
      <Text style={styles.sectionTitle}>Tipo de Conta</Text>
      
      {userTypes.map((userType) => (
        <TouchableOpacity
          key={userType.id}
          style={[
            styles.userTypeCard,
            selectedUserType === userType.id && styles.userTypeCardSelected,
          ]}
          onPress={() => handleUserTypeSelection(userType.id)}
        >
          <View style={styles.userTypeContent}>
            <View style={[
              styles.userTypeIcon,
              selectedUserType === userType.id && styles.userTypeIconSelected,
            ]}>
              <MaterialIcons
                name={userType.icon as any}
                size={24}
                color={selectedUserType === userType.id ? 'white' : '#3b82f6'}
              />
            </View>
            <View style={styles.userTypeInfo}>
              <Text style={[
                styles.userTypeLabel,
                selectedUserType === userType.id && styles.userTypeLabelSelected,
              ]}>
                {userType.label}
              </Text>
              <Text style={[
                styles.userTypeDescription,
                selectedUserType === userType.id && styles.userTypeDescriptionSelected,
              ]}>
                {userType.description}
              </Text>
            </View>
            {selectedUserType === userType.id && (
              <MaterialIcons name="check-circle" size={24} color="#10b981" />
            )}
          </View>
        </TouchableOpacity>
      ))}

      <Button
        mode="contained"
        onPress={() => setStep('form')}
        disabled={!selectedUserType}
        style={styles.continueButton}
      >
        Continuar
      </Button>
    </View>
  );

  const renderRegistrationForm = () => (
    <Card style={styles.formCard}>
      <Card.Content>
        <View style={styles.formHeader}>
          <TouchableOpacity onPress={handleBackToUserType} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={20} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.formTitle}>Dados da Conta</Text>
          <View style={styles.placeholder} />
        </View>

        <Chip
          style={styles.userTypeChip}
          textStyle={{ color: '#3b82f6' }}
        >
          {selectedUserType === 'teacher' ? 'Professor' : 'Gestor'}
        </Chip>

        <View style={styles.inputContainer}>
          <TextInput
            label="Nome Completo"
            value={name}
            onChangeText={setName}
            mode="outlined"
            left={<TextInput.Icon icon="person" />}
            style={styles.input}
            placeholder="Seu nome completo"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
            placeholder="seu@email.com"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Senha"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            placeholder="Mínimo 6 caracteres"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            label="Confirmar Senha"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            mode="outlined"
            secureTextEntry={!showConfirmPassword}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showConfirmPassword ? "eye-off" : "eye"}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            style={styles.input}
            placeholder="Confirme sua senha"
          />
        </View>

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={isLoading}
          disabled={isLoading}
          style={styles.registerButton}
          contentStyle={styles.registerButtonContent}
        >
          {isLoading ? 'Criando conta...' : 'Criar Conta'}
        </Button>
      </Card.Content>
    </Card>
  );

  const renderSocialRegister = () => (
    <View style={styles.socialContainer}>
      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Text style={styles.dividerText}>ou</Text>
        <Divider style={styles.divider} />
      </View>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleRegister}
        disabled={isGoogleLoading || !selectedUserType}
      >
        {isGoogleLoading ? (
          <View style={styles.googleButtonContent}>
            <MaterialIcons name="hourglass-empty" size={20} color="#374151" />
            <Text style={styles.googleButtonText}>Conectando...</Text>
          </View>
        ) : (
          <View style={styles.googleButtonContent}>
            <MaterialIcons name="language" size={20} color="#DB4437" />
            <Text style={styles.googleButtonText}>Continuar com Google</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footer}>
      <Text style={styles.footerText}>
        Já tem uma conta?{' '}
        <TouchableOpacity onPress={handleBackToLogin}>
          <Text style={styles.footerLink}>Fazer login</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );

  const renderTerms = () => (
    <View style={styles.termsContainer}>
      <Text style={styles.termsText}>
        Ao criar uma conta, você concorda com nossos{' '}
        <Text style={styles.termsLink}>Termos de Serviço</Text> e{' '}
        <Text style={styles.termsLink}>Política de Privacidade</Text>.
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderHeader()}
        
        {step === 'userType' ? renderUserTypeSelection() : (
          <>
            {renderRegistrationForm()}
            {renderSocialRegister()}
          </>
        )}
        
        {renderFooter()}
        {renderTerms()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  userTypeContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 20,
    textAlign: 'center',
  },
  userTypeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  userTypeCardSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#3b82f620',
  },
  userTypeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userTypeIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3b82f620',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userTypeIconSelected: {
    backgroundColor: '#3b82f6',
  },
  userTypeInfo: {
    flex: 1,
  },
  userTypeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  userTypeLabelSelected: {
    color: '#3b82f6',
  },
  userTypeDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  userTypeDescriptionSelected: {
    color: '#3b82f6',
  },
  continueButton: {
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    marginTop: 16,
  },
  formCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  placeholder: {
    width: 32,
  },
  userTypeChip: {
    backgroundColor: '#3b82f620',
    marginBottom: 24,
    alignSelf: 'flex-start',
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'transparent',
  },
  registerButton: {
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    marginTop: 8,
  },
  registerButtonContent: {
    paddingVertical: 8,
  },
  socialContainer: {
    marginBottom: 32,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  googleButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 12,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 16,
    color: '#6b7280',
  },
  footerLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  termsContainer: {
    paddingHorizontal: 20,
  },
  termsText: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 18,
  },
  termsLink: {
    color: '#3b82f6',
    fontWeight: '500',
  },
}); 