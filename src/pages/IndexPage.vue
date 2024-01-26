<template>
  <q-page padding>
    <q-table
      title="Products"
      :rows="products"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:top>
        <q-space />
        <q-btn color="primary" label="New" icon="add" :to="{name: 'formProduct'}" />
      </template>
      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="q-gutter-sm">
          <q-btn color="info" icon="edit" dense size="md" @click="handleEditProducts(props.row.id)"></q-btn>
          <q-btn color="red" icon="delete" dense size="md" @click="handleDeleteProducts(props.row.id)"></q-btn>
        </q-td>
      </template>
    </q-table>
  </q-page>
</template>

<script>
import {defineComponent, ref, onMounted} from 'vue'
import productsService from "src/services/product"
import {date, useQuasar} from 'quasar'
import {useRouter} from "vue-router"



export default defineComponent({
  name: 'IndexPage',
  setup() {
    const products = ref([])
    const productTypes = ref([])
    const { list, remove, listTypes } = productsService()
    const columns = [
      { name: 'id', field: 'id', label: 'Id', align: 'left', sortable: true },
      { name: 'name_uz', field: 'name_uz', label: 'Name (uz)', align: 'left', sortable: true },
      { name: 'cost', field: 'cost', label: 'Cost ($)', align: 'left', sortable: true },
      { name: 'address', field: 'address', label: 'Address', align: 'left', sortable: true },
      { name: 'created_date', field: 'created_date', label: 'Created date', align: 'left', sortable: true},
      { name: 'product_type_id', field: 'product_type_id', label: 'Product type id', align: 'left', sortable: true },
      { name: 'actions', field: 'actions', label: 'actions', align: 'right'},
    ]
    const $q = useQuasar()
    const router = useRouter()

    onMounted(() => {
      getProducts()
      getProductTypes()
    })

    const getProducts = async () => {
      try {
        const data = await list()
        products.value = data.map(product => ({
          ...product,
          created_date: date.formatDate(product.created_date, 'YYYY-MM-DD HH:mm')
        }))
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }
    const getProductTypes = async () => {
      try {
        const data = await listTypes()
        productTypes.value = data
        console.log(data)
      } catch (err) {
        console.log(err)
      }
    }

    const handleDeleteProducts = async (id) => {
      try {
        $q.dialog({
          title: 'Delete Product',
          message: 'Are you sure?',
          cancel: true,
          persistent: true,
        }).onOk(async () => {
          await remove(id)
          $q.notify({message: 'Successfully deleted!', icon: 'check', color: 'positive'})
          await getProducts()
        })
      } catch (err) {
        $q.notify({message: err, icon: 'times', color: 'negative'})
      }
    }

    const handleEditProducts = async (id) => {
      router.push({ name: 'formProduct', params: {id}})
    }

    return {
      products,
      productTypes,
      columns,
      handleDeleteProducts,
      handleEditProducts
    }
  }
})
</script>
