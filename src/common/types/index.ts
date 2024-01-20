interface SignUp {
  username: string;
  password: string;
  email: string;
}

interface LogIn {
  username: string;
  password: string;
}

interface Article {
  writer: string;
  title: string;
  content: string;
}

export {
  SignUp, LogIn,
  Article,
}