<template>
  <q-page padding>
    <q-form
      @submit="onSubmit"
      class="row q-col-gutter-lg"
    >

      <q-input
        outlined
        filled
        v-model="form.name_uz"
        label="Name"
        lazy-rules
        class="col-12 col-lg-6"
        :rules="[value => value && value.length > 0 || 'Please type something']"
      />

      <q-input
        outlined
        filled
        type="number"
        v-model="form.cost"
        label="Cost ($)"
        lazy-rules
        class="col-12 col-lg-6"
        :rules="[value => value && value.length > 0 || 'Please type something']"
      />

      <q-input
        outlined
        filled
        v-model="form.address"
        label="Address"
        lazy-rules
        class="col-12 col-lg-6"
        :rules="[value => value && value.length > 0 || 'Please type something']"
      />

      <q-input filled v-model="form.created_date">
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="form.created_date" mask="YYYY-MM-DD HH:mm">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>

        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-time v-model="form.created_date" mask="YYYY-MM-DD HH:mm" format24h>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-time>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>

      <q-select v-model="form.product_type_id"
                label="Product Type"
                :options="productTypes"
                option-label="name_uz"
                option-value="id"
                class="full-width"
      />

      <div class="col-12 q-gutter-lg">
        <q-btn label="Create"
               id="post_put"
               color="primary"
               class="float-right"
               icon="save"
               type="submit"
        />
        <q-btn
          label="Cancel"
          color="white"
          class="float-right"
          text-color="primary"
          :to="{name: 'home'}"
        />
      </div>

    </q-form>
  </q-page>
</template>

<script>
import {defineComponent, onMounted, ref} from "vue";
import productsService from "src/services/product";
import {date, useQuasar} from 'quasar'
import {useRoute, useRouter} from 'vue-router'


export default defineComponent({
  name: 'FormProduct',
  setup() {
    const {post, list, update, listTypes} = productsService()
    const $q = useQuasar()
    const router = useRouter()
    const route = useRoute()


    const form = ref({
      product_type_id: null,
      name_uz: null,
      cost: null,
      address: null,
      created_date: null,
    })

    const productTypes = ref([])

    onMounted(() => {
      getProductTypes()
      if (route.params.id) {
        getProducts()
        const post_put = document.querySelector('#post_put')
        post_put.innerHTML = 'Update'
      }
    })

    const getProducts = async () => {
      try {
        const response = await list()
        response.forEach((item) => {
          if(item.id == route.params.id){
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const minute = String(now.getMinutes()).padStart(2, '0');
            item.created_date = `${year}-${month}-${day} ${hour}:${minute}`;

            form.value = item;
          }
        })
        console.log(response)
      } catch (err) {
        console.log(err)
      }
    }

    const getProductTypes = async () => {
      try {
        const response = await listTypes()
        productTypes.value = response
        console.log(productTypes)
      } catch (err) {
        console.log(err)
      }
    }

    const onSubmit = async () => {
      try {
        form.value.created_date = new Date(form.value.created_date).toISOString();
        form.value.product_type_id = form.value.product_type_id.id
        if (route.params.id) {
          await update(form.value)
        } else {
          await post(form.value)
        }
        $q.notify({message: 'Successfully created!', icon: 'check', color: 'positive'})
        router.push({name: 'home'})
      } catch (err) {
        console.error(err)
      }
    }

    return {
      form,
      onSubmit,
      model: ref('earth'),
      productTypes,
    }
  },
})
</script>

<style scoped>

</style>
