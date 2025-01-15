export const authGuard = (role: string) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') as string);
    if(currentUser?.role !== undefined && currentUser?.role === role){
        return true;
    }
    return false;
}