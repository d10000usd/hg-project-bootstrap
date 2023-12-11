// YourComponent.ts
import { ref, onMounted } from 'vue';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase.json';

const db = getFirestore(initializeApp(firebaseConfig));

const captureData = ({
  "monitoringCoin": "KRW-ETH",
  "sortingOrder": "L52",
  "settingValue":97.5,
  "shouldExecute": true,
  "messageCounter": 0,
  "componentname": "TsWebsocket_telegram",
  "status": "Rise Monitoring",
  "asc_desc": "asc",
  "coinea": 130,
  "eta": 111111111111111111111,
  "addRatio": 0.5,
  "alarmSendingEa": 2
});



const createData = async (collection_name, document_id,captureData) => {
  try {
    const docRef = doc(collection(db, collection_name), document_id);
    await setDoc(docRef, captureData);
    console.log('createData');
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

const readAllData = async (collection_name) => {
  const data = ref([]); // Assuming data is a ref

  try {
    const querySnapshot = await getDocs(collection(db, collection_name))
    data.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    console.log('readData');
    return data.value[0]; // Return the array, not the ref
  } catch (e) {
    console.error('Error reading documents: ', e);
  }
};

const updateData = async (collection_name, document_id,captureData) => {
  try {
    const docRef = doc(db, collection_name, document_id);
    await updateDoc(docRef, captureData);
    console.log('Document updated successfully');
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

const updateData_fildvalue = async (collection_name, document_id,captureData) => {
  try {
    const docRef = doc(db, collection_name, document_id);
    await updateDoc(docRef, { componentname: captureData });
    console.log('Document updated successfully');
  } catch (e) {
    console.error('Error updating document: ', e);
  }
};

const deleteData = async (collection_name, document_id) => {
  try {
    const docRef = doc(db, collection_name, document_id);
    await deleteDoc(docRef);
    console.log('Document deleted successfully');
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
};



export { captureData, createData, readAllData, updateData, updateData_fildvalue, deleteData };
