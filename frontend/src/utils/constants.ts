// TODO do I really need this or is create-react-app doing all the necessary work?
// import dotenvconfig from 'dotenv/config';

for (let key in process.env) {
  console.log("Env " + key + "=" + process.env[key]);
}

const checkIsDefined = (envVarName: string): string => {
    const envVar = process.env[envVarName];
    if (envVar === undefined) {
        throw new Error(`Environment variable ${envVarName} is undefined`);
    } else {
        console.log("Loading environment variable " + envVarName + "=" + envVar);
        return envVar;
    }
}

export const BACKEND_URL: URL = new URL(checkIsDefined("REACT_APP_BACKEND_URL"));
export const STATIC_URL: URL = new URL(checkIsDefined("REACT_APP_STATIC_URL"));

