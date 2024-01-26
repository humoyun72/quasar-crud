<template>
  <q-page padding>
    <q-table
      title="Product Types"
      :rows="productTypes"
      :columns="columns"
      row-key="name"
    >
    </q-table>
  </q-page>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue'
import productsService from "src/services/product"

export default defineComponent({
  name: "SaleProduct",
  setup () {
    const productTypes = ref([])
    const { listTypes } = productsService()
    const columns = [
      { name: 'id', field: 'id', label: 'Id', align: 'left', sortable: true },
      { name: 'name_uz', field: 'name_uz', label: 'Name (uz)', align: 'left', sortable: true },
      { name: 'name_ru', field: 'name_ru', label: 'Name (ru)', align: 'left', sortable: true },
      { name: 'name_uk', field: 'name_uk', label: 'Name (uk)', align: 'left', sortable: true },
      // { name: 'description', field: 'description', label: 'description', align: 'left', sortable: true },
    ]

    onMounted(() => {
      getProductTypes()
    })

    const getProductTypes = async () => {
      try {
        const data = await listTypes()
        productTypes.value = data
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }

    return {
      columns,
      productTypes
    }
  },

})
</script>

<style scoped>

</style>
