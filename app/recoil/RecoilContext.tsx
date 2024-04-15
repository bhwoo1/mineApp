"use client"
import { RecoilRoot, atom } from "recoil";


export const CategoryAtom = atom({
    key: "CategoryState",
    default: "all",
});

export const SearchCategoryAtom = atom({
    key: "SearchCategoryState",
    default: "title",
});

export const SearchAtom = atom({
    key: "SearchState",
    default: "",
});

export const SearchUserAtom = atom({
    key: "SearchUserState",
    default: {
        user: "",
        username: ""
    }
});


export default function RecoilContextProvider({ children }: { children: React.ReactNode }) {
    return <RecoilRoot>{children}</RecoilRoot>;
};