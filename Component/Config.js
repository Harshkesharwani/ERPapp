//App Url
export const url = 'http://10.0.2.2:5000';
// export const url = 'http://Erp-school-env.eba-q984mcqv.us-east-1.elasticbeanstalk.com';
// export const url = 'http://52.44.134.184';
// export const url = 'http://192.168.29.96:5000';

import { useRoute } from '@react-navigation/native';

const Config = () => {
  const route = useRoute();
  const hiddenRoutes = ['login', 'sign', 'ForgotPassword', 'ConfirmPassword'];
  return !hiddenRoutes.includes(route.name);
};

export default Config;
