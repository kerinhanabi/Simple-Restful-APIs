<template lang="pug">
div.container.py-5
  //- Header Banner
  header.text-center.mb-5
    h1.display-5.fw-bold.text-primary Nuxt RESTful API Workspace
    p.lead Clean CRUD isolation demonstration utilizing 
      code.bg-light.px-2.py-1.rounded config.js

  //- Split Workspace Panel Grid
  main.row.g-4
    
    //- LEFT PANEL: Operational Form Container
    section.col-lg-4
      div.card.shadow-sm.sticky-top(style="top: 20px; z-index: 10;")
        div.card-body
          h2.card-title.h5.mb-4.text-secondary
            | {{ isEditing ? '📝 Edit Item Details' : '➕ Add New Item' }}
          
          form(@submit.prevent="handleSubmit")
            div.mb-3
              label.form-label.fw-semibold(for="title") Record Title
              input#title.form-control(
                v-model="form.title" 
                type="text" 
                placeholder="Enter context title..." 
                required
              )

            div.mb-3
              label.form-label.fw-semibold(for="body") Content Description
              textarea#body.form-control(
                v-model="form.body" 
                rows="4" 
                placeholder="Write description content details here..." 
                required
              )

            div.d-grid.d-md-flex.gap-2.mt-4
              button.btn.btn-primary.flex-grow-1(type="submit" :disabled="loading") 
                | {{ isEditing ? 'Save Changes' : 'Submit Entry' }}
              button.btn.btn-outline-secondary(
                v-if="isEditing" 
                type="button" 
                @click="resetForm"
              ) Cancel

    //- RIGHT PANEL: Interactive Database Records Table View
    section.col-lg-8
      div.card.shadow-sm
        div.card-body
          h2.card-title.h5.mb-4.text-secondary 📋 Current Database Records
          
          //- API Network Activity Spinners
          div.alert.alert-info.d-flex.align-items-center(v-if="loading && items.length === 0") 
            div.spinner-border.spinner-border-sm.me-3(role="status")
            span Accessing remote JSONPlaceholder API endpoints...

          div.alert.alert-warning(v-else-if="items.length === 0") 
            | Empty workspace state. Insert an entry on the form panel to begin.

          //- Responsive Data Table
          div.table-responsive(v-else)
            table.table.table-hover.align-middle.border.mb-0
              thead.table-light
                <tr>
                  <th scope="col" style="width: 8%">ID</th>
                  <th scope="col" style="width: 32%">Title</th>
                  <th scope="col" style="width: 40%">Content Description</th>
                  <th scope="col" style="width: 20%" class="text-end">Actions</th>
                </tr>
              tbody
                tr(v-for="item in items" :key="item.id")
                  td
                    span.badge.bg-secondary.font-monospace # {{ item.id }}
                  td
                    strong.text-dark {{ item.title }}
                  td
                    p.text-muted.small.mb-0.text-truncate(style="max-width: 280px;") {{ item.body }}
                  td.text-end
                    div.btn-group.btn-group-sm(role="group")
                      button.btn.btn-outline-primary(
                        @click="startEdit(item)" 
                        title="Edit Item"
                      ) Edit
                      button.btn.btn-outline-danger(
                        @click="handleDelete(item.id)" 
                        title="Remove Item"
                      ) Delete
</template>

<script>
import apiService from "~/config.js"

export default {
  name: "WorkspaceDashboard",
  data() {
    return {
      items: [],
      form: {
        title: "",
        body: "", // Maps to the text area input form
      },
      loading: false,
      isEditing: false,
      editingId: null,
    }
  },
  methods: {
    // 1. READ / LIST ACTION
    async fetchItems() {
      this.loading = true
      try {
        const products = await apiService.getAll()
        // Map 'description' from DummyJSON to 'body' used in your Pug template
        this.items = products.map((item) => ({
          id: item.id,
          title: item.title,
          body: item.description || "",
        }))
      } catch (err) {
        console.error(err)
        alert("Failed to read test data from DummyJSON.")
        this.items = []
      } finally {
        this.loading = false
      }
    },

    // 2. CREATE & UPDATE HANDLER
    async handleSubmit() {
      this.loading = true
      try {
        if (this.isEditing) {
          let updatedItem

          if (this.editingId > 30) {
            // Adjusted guard based on limit=30
            updatedItem = { id: this.editingId, ...this.form }
          } else {
            // Re-map back to what DummyJSON expects on write
            const res = await apiService.edit(this.editingId, {
              title: this.form.title,
              description: this.form.body,
            })
            updatedItem = {
              id: res.id,
              title: res.title,
              body: res.description,
            }
          }

          const index = this.items.findIndex((i) => i.id === this.editingId)
          if (index !== -1) {
            this.items.splice(index, 1, updatedItem)
          }
          alert(`Successfully updated item #${this.editingId} (Simulated)`)
        } else {
          // Re-map form fields to API parameters
          const res = await apiService.add({
            title: this.form.title,
            description: this.form.body,
          })

          const newItem = {
            id: res.id,
            title: res.title,
            body: res.description,
          }

          const nextId =
            this.items.length > 0
              ? Math.max(...this.items.map((i) => i.id)) + 1
              : 151
          newItem.id = nextId

          this.items.unshift(newItem)
          alert("Successfully created new record! (Simulated)")
        }
        this.resetForm()
      } catch (err) {
        console.error(err)
        alert("Action failed to execute against the server.")
      } finally {
        this.loading = false
      }
    },

    // 3. DELETE ACTION
    async handleDelete(id) {
      if (!confirm(`Are you sure you want to drop record entry #${id}?`)) return

      this.loading = true
      try {
        if (id <= 30) {
          // Sync guard boundary with product limit
          await apiService.delete(id)
        }
        this.items = this.items.filter((item) => item.id !== id)
        alert(`Successfully deleted item #${id} (Simulated)`)
      } catch (err) {
        alert("Failed to drop item from server.")
      } finally {
        this.loading = false
      }
    },

    // UI Helpers
    startEdit(item) {
      this.isEditing = true
      this.editingId = item.id
      this.form.title = item.title
      this.form.body = item.body
      window.scrollTo({ top: 0, behavior: "smooth" })
    },
    resetForm() {
      this.form.title = ""
      this.form.body = ""
      this.isEditing = false
      this.editingId = null
    },
  },
  mounted() {
    this.fetchItems()
  },
}
</script>
