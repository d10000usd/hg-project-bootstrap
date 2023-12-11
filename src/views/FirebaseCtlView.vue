<script setup>
import { ref, onMounted } from 'vue'

import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore'
import { initializeApp } from 'firebase/app'

import firebaseConfig from './firebase.json'
const db = getFirestore(initializeApp(firebaseConfig))
const captureData = ref({
  "monitoringCoin": "KRW-ETH",
  "sortingOrder": "L52",
  "settingValue": 97.5,
  "shouldExecute": true,
  "messageCounter": 0,
  "componentname": "TsWebsocket_telegram",
  "status": "Rise Monitoring",
  "asc_desc": "asc",
  "coinea": 130,
  "eta": 0,
  "addRatio": 0.5,
  "alarmSendingEa": 2
})
const data = ref([])

const createData = async (collection_name, document_id) => {
  try {
    const docRef = doc(collection(db, collection_name), document_id); // Create a reference with the specified document ID
    await setDoc(docRef, captureData.value); // Set the document data
    console.log('createData');
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}
const readAllData = async (collection_name) => {
  try {
    const querySnapshot = await getDocs(collection(db, collection_name))
    data.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
    return data.value[0]
    console.log('readData');
  } catch (e) {
    console.error('Error reading documents: ', e)
  }
}

const updateData = async (collection_name, document_id) => {
  try {
    const docRef = doc(db, collection_name, document_id)
    // const docRef = doc(db, 'your_collection_name', 'document_id')
    await updateDoc(docRef, captureData.value)
    console.log('Document updated successfully')
  } catch (e) {
    console.error('Error updating document: ', e)
  }
}
const updateData_fildvalue = async (collection_name, document_id) => {
  // Check the field type in the data
  try {
    const docRef = doc(db, collection_name, document_id)
    // const docRef = doc(db, 'your_collection_name', 'document_id')
    await updateDoc(docRef, { componentname: captureData.value })
    console.log('Document updated successfully')
  } catch (e) {
    console.error('Error updating document: ', e)
  }
}
const deleteData = async (collection_name, document_id) => {
  try {
    const docRef = doc(db, collection_name, document_id)
    await deleteDoc(docRef)
    console.log('Document deleted successfully')
  } catch (e) {
    console.error('Error deleting document: ', e)
  }
}
onMounted(() => {
  // Call readAllData('COIN') when the component is mounted
  readAllData('COIN');
});

</script>

<template>
  <body class="container body-full">
    <div>
      <h1>Firebase Data</h1>
      <button @click="createData('COIN', 'ETH')">Create Data</button>
      <button @click="readAllData('COIN')">Read Data</button>
      <button @click="updateData('COIN', 'ETH')">Update Data</button>
      <button @click="deleteData('COIN', 'ETH')">Delete Data</button>
      <button @click="updateData_fildvalue('COIN', 'ETH')">Fild Data Update</button>
      <pre>{{ data }}</pre>

    </div>

  </body>
</template>
  