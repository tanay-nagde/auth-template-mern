import bcrypt from 'bcrypt';

const hashvalue = async (password :string , salt?: number )  => {
 return bcrypt.hash(password, salt || 10);

}

const isPasswordcorrect = async (password :string , hashedPassword :string)=> {
   return bcrypt.compare(password, hashedPassword);
}

export { hashvalue, isPasswordcorrect };