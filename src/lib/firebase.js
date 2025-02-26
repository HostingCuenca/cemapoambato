import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, getDoc, doc, query, where, orderBy, limit } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyA2IjVt79YkzU-AqLzbJFchB_qKkXYmwFs",
    authDomain: "torisoftt-cemapo-cms.firebaseapp.com",
    projectId: "torisoftt-cemapo-cms",
    storageBucket: "torisoftt-cemapo-cms.appspot.com",
    messagingSenderId: "516908436814",
    appId: "1:516908436814:web:e6570bb3fb66ecac7ae21f",
    measurementId: "G-8MX35HMWW5"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Función para obtener todos los cursos
export async function getAllCourses() {
    try {
        const coursesCollection = collection(db, "courses");
        const coursesQuery = query(
            coursesCollection,
            where("isPublished", "==", true),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(coursesQuery);
        const courses = [];

        querySnapshot.forEach((doc) => {
            courses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return courses;
    } catch (error) {
        console.error("Error al obtener cursos:", error);
        return [];
    }
}

// Función para obtener un curso específico por ID
export async function getCourseById(courseId) {
    try {
        const courseRef = doc(db, "courses", courseId);
        const courseSnap = await getDoc(courseRef);

        if (courseSnap.exists()) {
            return {
                id: courseSnap.id,
                ...courseSnap.data()
            };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error al obtener el curso:", error);
        return null;
    }
}

// Función para obtener cursos destacados
export async function getFeaturedCourses(limitCount = 3) {
    try {
        const coursesCollection = collection(db, "courses");
        const coursesQuery = query(
            coursesCollection,
            where("isPublished", "==", true),
            orderBy("createdAt", "desc"),
            limit(limitCount)
        );

        const querySnapshot = await getDocs(coursesQuery);
        const courses = [];

        querySnapshot.forEach((doc) => {
            courses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return courses;
    } catch (error) {
        console.error("Error al obtener cursos destacados:", error);
        return [];
    }
}

// Función para obtener cursos por categoría
export async function getCoursesByCategory(categoryId) {
    try {
        const coursesCollection = collection(db, "courses");
        const coursesQuery = query(
            coursesCollection,
            where("categoryId", "==", categoryId),
            where("isPublished", "==", true),
            orderBy("createdAt", "desc")
        );

        const querySnapshot = await getDocs(coursesQuery);
        const courses = [];

        querySnapshot.forEach((doc) => {
            courses.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return courses;
    } catch (error) {
        console.error("Error al obtener cursos por categoría:", error);
        return [];
    }
}

// Función para obtener todas las categorías
export async function getAllCategories() {
    try {
        const categoriesCollection = collection(db, "categories");
        const querySnapshot = await getDocs(categoriesCollection);
        const categories = [];

        querySnapshot.forEach((doc) => {
            categories.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return categories;
    } catch (error) {
        console.error("Error al obtener categorías:", error);
        return [];
    }
}