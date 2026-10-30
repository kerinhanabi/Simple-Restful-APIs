// my-nuxt-app/app/config.js
const BASE_URL = "https://dummyjson.com/products"

export default {
  // READ / LIST
  async getAll() {
    const data = await $fetch(`${BASE_URL}?limit=30`)
    // Extract nested product array from DummyJSON structure
    return data?.products || []
  },

  // CREATE
  async add(payload) {
    return await $fetch(`${BASE_URL}/add`, {
      method: "POST",
      body: payload,
    })
  },

  // UPDATE
  async edit(id, payload) {
    return await $fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      body: payload,
    })
  },

  // DELETE
  async delete(id) {
    return await $fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    })
  },
}
