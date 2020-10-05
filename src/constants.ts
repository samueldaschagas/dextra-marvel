/**
 * Constantes utilizadas para configurar a URL base, chaves pública e privada
 * por meio de variáveis de ambiente. As chaves necessárias para ter acesso a API são disponibilizadas por meio de registro na
 * plataforma da Marvel. Link: https://developer.marvel.com. 
 * */
export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const PUBLIC_KEY = process.env.REACT_APP_PUBLIC_KEY;
export const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;