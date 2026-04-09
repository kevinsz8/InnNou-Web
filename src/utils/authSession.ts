export const forceLogout = () => {
    localStorage.clear();

    window.location.href = "/";
};