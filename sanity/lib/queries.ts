import { defineQuery } from "next-sanity";

export const USER_BY_GITHUB_ID_QUERY = defineQuery(`
   *[_type == "author" && id == $id][0]{
    _id,
    id,
    name,
    email,
    password,
    imageUrl,
   } 
`);

export const CHECK_FOR_EXISTING_USER = defineQuery(`
   *[_type == "user" && email == $email][0]
`);

export const USER_BY_ID_QUERY = defineQuery(`
   *[_type == "user" && _id == $id][0]{
  _id,
  id,
  name,
  surname,
  email,
  password,
  "image": image.asset->url,
  imageUrl,
  _rev,
  _type,
  _createdAt,
  _updatedAt
}
`);

export const USER_BY_EMAIL_QUERY = defineQuery(`
   *[_type == "user" && email == $email][0]{
  _id,
  id,
  name,
  surname,
  email,
  password,
  "image": image.asset->url,
  imageUrl,
  _rev,
  _type,
  _createdAt,
  _updatedAt
}
`);


export const CHECK_FOR_ID_QUERY = defineQuery(`
   *[_type == "user" && id == $generatedId][0]{
      id
   }
`)