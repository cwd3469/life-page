import { db } from "./firebase";
import { getFirestore } from "firebase/firestore";

const fireStore = getFirestore(db.app);
export default fireStore;
