//create
//search
//searchPostsByUserID
//getByPostID
//upvote
//downvote
//flag
//delete (for admin)
import {dbConnPool} from '../repo/db-client';
import {searchPostsByTitleInDB, searchPostsByTagInDB, createPostInDB} from '../repo/post-repo';
import { createTagInDBIfNotExists, createPostTagInDB } from '../repo/tag-repo';


let searchPostsByTagOrTitle = async (queryString) => {
  let postsByTitleArr = await searchPostsByTitleInDB(queryString)
  let postsByTagArr = await searchPostsByTagInDB(queryString)

  //TODO: to remove duplicates based on postID
  return postsByTitleArr.concat(postsByTagArr)
  
}

let searchPostsByUserID = async (userID) => {
  let conn;
  try {
  
    conn = await dbConnPool.getConnection();
    const resp = await conn.query("select * from post where authorID="+userID);
    console.log(resp);
    return resp;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

let create = async (input_json) => {
  try {
    let createPostResponse = await createPostInDB(input_json)

    if (input_json.tags != undefined && input_json.tags.length > 0 ){
      let createTagResponse = await createTagInDBIfNotExists(input_json.tags)
      console.log(createTagResponse)
      let createPostTagResponse = await createPostTagInDB(createPostResponse.insertId, input_json.tags)
      console.log(createPostTagResponse)
    }
    

    return createPostResponse

  } catch (err) {
    throw err;
  } finally {
    
  }

}

let upvote = async (postID) => {
  let conn;
  try {
  
    conn = await dbConnPool.getConnection();
    const tmp = await conn.query("select upvote from post where postID="+postID);
    const current_counter = tmp[0].upvote;
    const resp = await conn.query("UPDATE post set upvote=? where postID=?", [current_counter+1, postID]);
    console.log(resp);
    return resp;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

let downvote = async (postID) => {
  let conn;
  try {
  
    conn = await dbConnPool.getConnection();
    const tmp = await conn.query("select downvote from post where postID="+postID);
    const current_counter = tmp[0].downvote;
    const resp = await conn.query("UPDATE post set downvote=? where postID=?", [current_counter+1, postID]);
    console.log(resp);
    return resp;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}

let flag = async (postID) => {
  let conn;
  try {
  
    conn = await dbConnPool.getConnection();
    const resp = await conn.query("UPDATE post set isFlagged=1 where postID="+postID);
    console.log(resp);
    return resp;
  } catch (err) {
    throw err;
  } finally {
    if (conn) conn.release(); //release to pool
  }
}


let getByPostID = async (postID) => {
    let conn;
    try {
  
      conn = await dbConnPool.getConnection();
      const rows = await conn.query("SELECT * from post where postID="+postID);
      return rows[0]
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  let getPosts = async () => {
    let conn;
    try {
      conn = await dbConnPool.getConnection();
      const rows = await conn.query("SELECT * from post");
      return rows
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

  let deletePost = async (postID) => {
    let conn;
    try {
      conn = await dbConnPool.getConnection();
      const rows = await conn.query("DELETE from post where postID="+postID);
      return rows
    } catch (err) {
      throw err;
    } finally {
      if (conn) conn.release(); //release to pool
    }
  }

export {
  searchPostsByTagOrTitle, getByPostID, create, searchPostsByUserID, upvote, downvote, deletePost, flag, getPosts
}