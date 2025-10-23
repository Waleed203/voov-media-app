import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flexGrow: 1,
  },
  wrapper: {
    width: '90%',
    marginTop: '10%',
    alignSelf: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#25284b',
    position: 'absolute',
    top: 50,
    left: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoDiv: {
    width: '100%',
    marginTop: '15%',
    alignItems: 'center',
  },
  logo: {
    width: '50%',
    height: 100,
    objectFit: 'contain'
  },
  signDiv: {
    width: '100%',
    marginTop: 18,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  signLabel: {
    fontSize: 24,
    color: '#eee',
  },
  form: {
    width: '100%',
    marginTop: '10%',
    // backgroundColor: 'orange',
  },
  field: {
    width: '100%',
    height: 40,
    paddingHorizontal: 15,
    borderWidth: 0.6,
    borderColor: '#fff',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '5%',
  },
  input: {
    flex: 1,
    marginLeft: 5,
    color: '#fff',
    fontSize: 14,
  },
  forgotPass: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
  },
  remember: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    color: '#eee',
    fontSize: 12,
    marginLeft: 7,
  },
  forgotText: {
    color: '#eee',
    fontSize: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#47c2f0',
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: '10%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  signup: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 10
  },
  signupText: {
    color: '#eee',
    fontSize: 12,
  },
  signupLink: {
    color: '#eee',
  },
  orSection: {
    flexDirection: 'row',
    maxWidth: '40%',
    alignSelf: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  dash: {
    width: 25,
    height: 2,
    backgroundColor: '#eee',
  },
  orCircle: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  orText: {
    color: '#eee',
    fontSize: 12,
  },
  socialButton: {
    width: '80%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: '5%',
  },
  socialButtonText: {
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '700',
  },
  fbText: {
    color: '#1c39a1',
  },
  googleText: {
    color: '#d95946',
  },
  facebookButton: {
    backgroundColor: '#fff',
  },
  googleButton: {
    backgroundColor: '#f5f5f5',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#0054e9',
    borderColor: '#0054e9',
  },
});
