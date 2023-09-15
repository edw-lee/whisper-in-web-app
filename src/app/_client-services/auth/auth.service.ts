import { UserProfile, logout as userLogout } from "@/store/slices/user.slice";
import { AppDispatch } from "@/store/store";
import axios from "axios";

const route = "/api/auth"

export async function googleLogin() {
    return new Promise<{ user: UserProfile }>((resolve, reject) => {
        try {
            const newWindow = window.open(`${route}/google/login`, "_blank", "toolbar=0,menu=0,location=0");

            if (newWindow) {
                window.addEventListener("message", (event) => {
                    if (event.origin == window.location.origin) {
                        if (event.data?.signin_status == "SUCCESS") {
                            newWindow.close();
                            const user = event.data.user;

                            resolve({ user });
                        } else {
                            reject("Failed to login.");
                        }
                    }
                }, false)
            } else {
                reject("Failed to open window.");
            }
        } catch (error) {
            reject(error)
        }
    });
}

export async function logout(dispatch: AppDispatch) {
    dispatch(userLogout());
    
    await axios.get(`${route}/logout`);
}