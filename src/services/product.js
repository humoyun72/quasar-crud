import useApi from "src/composables/useApi";


export default function productsService() {
  const {list, listTypes, post, remove, update, getById} = useApi('product')

  return {
    list, post, remove, update, getById, listTypes
  }
}
