import { defineQuery } from "next-sanity";

export const USER_BY_GITHUB_ID_QUERY = defineQuery(`
   *[_type == "user" && id == $id][0]{
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

export const ANALYSIS_BY_USER_ID_QUERY = defineQuery(`
   *[_type == "analysis" && user._ref == $id] | order(_createdAt desc) {
   _id,
  title,
  _updatedAt,
  _createdAt,
  _rev,
  _type,
  slug,
  user -> {
   _id, name, email, "image": image.asset->url, imageUrl, _createdAt, _updatedAt, _rev, _type
  },
  isgood,
  userinput,
  aianalysis
   }
`)

export const ANALYSIS_BY_ANALYSIS_SLUG_QUERY = defineQuery(`
   *[_type == "analysis" && slug.current == $slug][0] {
   _id,
  title,
  _updatedAt,
  _createdAt,
  _rev,
  _type,
  slug,
  user -> {
   _id, name, email, "image": image.asset->url, imageUrl, _createdAt, _updatedAt, _rev, _type
  },
  isgood,
  userinput,
  aianalysis
   }
`)