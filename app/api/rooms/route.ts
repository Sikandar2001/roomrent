import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  serverTimestamp,
  Timestamp
} from "firebase/firestore";

export async function GET(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const docRef = doc(db, "rooms", id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        return NextResponse.json({ error: "Room not found" }, { status: 404 });
      }
      
      const data = docSnap.data();
      // Map Firestore Timestamp to Date or ISO string if needed
      return NextResponse.json({ 
        id: docSnap.id, 
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      });
    }

    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    const rooms = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : data.createdAt,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate().toISOString() : data.updatedAt,
      };
    });
    
    return NextResponse.json(rooms);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const data = await request.json();
    const roomsRef = collection(db, "rooms");
    const docRef = await addDoc(roomsRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    
    return NextResponse.json({ id: docRef.id, ...data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const data = await request.json();
    const docRef = doc(db, "rooms", id);
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    
    return NextResponse.json({ id, ...data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!db) {
      return NextResponse.json({ error: "Firebase not initialized" }, { status: 500 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const docRef = doc(db, "rooms", id);
    await deleteDoc(docRef);
    
    return NextResponse.json({ message: "Room deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
