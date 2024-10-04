export const validarEmail = (email: string): boolean => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const validarSenha = (senha: string): boolean => {
    return senha.length >= 6;
};
