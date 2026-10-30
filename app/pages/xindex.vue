<!-- src/views/Home.vue -->
<!-- <template lang="pug">
div.demo-container
  header.app-header
    h1 Nuxt RESTful API Workspace
    p Clean CRUD isolation demonstration utilizing 
      code config.js

  main.grid-layout
    //- LEFT SECTION: Dynamic Form Handler
    section.card.form-card
      h2 {{ isEditing ? '📝 Edit Item Details' : '➕ Add New Item' }}
      
      form(@submit.prevent="handleSubmit")
        div.form-group
          label(for="title") Title
          input#title(
            v-model="form.title" 
            type="text" 
            placeholder="Enter context title..." 
            required
          )

        div.form-group
          label(for="body") Content Description
          textarea#body(
            v-model="form.body" 
            rows="4" 
            placeholder="Write description content details here..." 
            required
          )

        div.form-actions
          button.btn.btn-primary(type="submit") 
            | {{ isEditing ? 'Save Changes' : 'Submit Entry' }}
          button.btn.btn-secondary(
            v-if="isEditing" 
            type="button" 
            @click="resetForm"
          ) Cancel Edit

    //- RIGHT SECTION: Live Render List
    section.card.list-card
      h2 📋 Current Database Records
      
      div.status-msg(v-if="isLoading") 
        | Connecting to API server endpoints...

      div.status-msg.empty(v-else-if="items.length === 0") 
        | No records found. Create an item on the left form container to begin.

      div.items-stack(v-else)
        div.item-row(v-for="item in items" :key="item.id")
          div.item-content
            h3 {{ item.name }}
            p {{ item.body }}
            small.id-badge ID: {{ item.id }}
          
          div.row-actions
            button.btn-icon.edit-btn(
              @click="startEdit(item)" 
              title="Edit"
            ) Edit
            button.btn-icon.delete-btn(
              @click="handleDelete(item.id)" 
              title="Delete"
            ) Delete
</template> -->
<template lang="pug">
div.container.py-5
  //- Header Section
  header.text-center.mb-5
    h1.display-4.fw-bold.text-primary Nuxt RESTful API Workspace
    p.lead Clean CRUD isolation demonstration utilizing 
      code.bg-light.px-2.py-1.rounded config.js

  //- Main Layout (Split 50/50 using Bootstrap Grid)
  main.row.g-4
    
    //- LEFT SECTION: Dynamic Form Handler (6 columns wide)
    section.col-md-6
      div.card.shadow-sm
        div.card-body
          h2.card-title.h4.mb-4.text-secondary
            | {{ isEditing ? '📝 Edit Item Details' : '➕ Add New Item' }}
          
          form(@submit.prevent="handleSubmit")
            div.mb-3
              label.form-label(for="title") Title
              input#title.form-control(
                v-model="form.title" 
                type="text" 
                placeholder="Enter context title..." 
                required
              )

            div.mb-3
              label.form-label(for="body") Content Description
              textarea#body.form-control(
                v-model="form.body" 
                rows="4" 
                placeholder="Write description content details here..." 
                required
              )

            div.d-flex.gap-2
              button.btn.btn-primary(type="submit") 
                | {{ isEditing ? 'Save Changes' : 'Submit Entry' }}
              button.btn.btn-outline-secondary(
                v-if="isEditing" 
                type="button" 
                @click="resetForm"
              ) Cancel Edit

    //- RIGHT SECTION: Live Render List (6 columns wide)
    section.col-md-6
      div.card.shadow-sm
        div.card-body
          h2.card-title.h4.mb-4.text-secondary 📋 Current Database Records
          
          //- Status Indicators
          div.alert.alert-info(v-if="loading") 
            div.spinner-border.spinner-border-sm.me-2(role="status")
            | Connecting to API server endpoints...

          div.alert.alert-warning(v-else-if="items.length === 0") 
            | No records found. Create an item on the left form container to begin.

          //- Scrollable Records List Stack
          div.list-group(v-else)
            div.list-group-item.list-group-item-action.d-flex.justify-content-between.align-items-start.p-3(
              v-for="item in items" 
              :key="item.id"
            )
              div.me-auto
                h3.h5.mb-1.text-dark {{ item.title || item.name || 'Untitled' }}
                p.text-muted.mb-1.small {{ item.body }}
                span.badge.bg-secondary ID: {{ item.id }}
              
              div.btn-group.btn-group-sm.ms-2(role="group")
                button.btn.btn-outline-primary(
                  @click="startEdit(item)" 
                  title="Edit"
                ) Edit
                button.btn.btn-outline-danger(
                  @click="deleteItem(item.id)" 
                  title="Delete"
                ) Delete
</template>

<script>
// import apiService from '../apiService.js'; // Note the relative path change (../)
import apiService from "../config.js"

export default {
  data() {
    return {
      items: [],
      form: {
        title: "",
        body: "",
      },
      // itemName: '',
      loading: false,
      isEditing: false,
      editingId: null,
    }
  },
  methods: {
    async fetchItems() {
      this.loading = true
      try {
        this.items = await apiService.getAll()
      } catch (err) {
        alert("Failed to load list details.")
      } finally {
        this.loading = false
      }
    },
    // async handleSubmit() {
    //   try {
    //     if (this.isEditing) {
    //       await apiService.edit(this.editingId, { name: this.itemName });
    //     } else {
    //       await apiService.add({ name: this.itemName });
    //     }
    //     this.resetForm();
    //     await this.fetchItems();
    //   } catch (err) { alert("Action failed."); }
    // },
    async handleSubmit() {
      try {
        if (this.isEditing) {
          // Pass title and body
          await apiService.edit(this.editingId, {
            title: this.form.title,
            body: this.form.body,
          })
        } else {
          // Pass title and body
          await apiService.add({ title: this.form.title, body: this.form.body })
        }
        this.resetForm()
        await this.fetchItems()
      } catch (err) {
        alert("Action failed.")
      }
    },
    async deleteItem(id) {
      if (confirm("Are you sure?")) {
        try {
          await apiService.delete(id)
          await this.fetchItems()
        } catch (err) {
          alert("Could not remove item.")
        }
      }
    },
    startEdit(item) {
      this.isEditing = true
      this.editingId = item.id
      this.itemName = item.name
    },

    resetForm() {
      this.form.title = ""
      this.form.body = ""
      this.isEditing = false
      this.editingId = null
    },
    // resetForm() {
    //   this.itemName = '';
    //   this.isEditing = false;
    //   this.editingId = null;
    // }
  },
  mounted() {
    this.fetchItems()
  },
}
</script>
