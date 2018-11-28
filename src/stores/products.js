import { observable, action, runInAction } from 'mobx'
import requestApi from '@/utils/http'
import { parseProductsParams } from '@/utils/common'

class Products {
  @observable listLoading = false

  @observable formLoading = false

  @observable list = []

  @observable categories = [
    {
      name: '食品',
      value: '1',
    },
    {
      name: '服装',
      value: '2',
    },
    {
      name: '家电',
      value: '3',
    },
  ]

  @observable page = 1

  @observable total = 0

  @observable filter = {}

  @action.bound fetchProducts(search) {
    const query = parseProductsParams(search)
    const { filter } = query

    this.filter = filter
    this.listLoading = true
    requestApi
      .get(`/products${search}`)
      .then(resp => {
        runInAction(() => {
          this.list = resp.data
          this.page = resp.page
          this.total = resp.total
        })
      })
      .catch(err => {
        return Promise.reject(err)
      })
      .finally(() => {
        runInAction(() => {
          this.listLoading = false
        })
      })
  }

  @action.bound addProduct(data) {
    this.formLoading = true
    return requestApi
      .post('/product', null, data)
      .then(resp => {
        runInAction(() => {
          this.list.unshift(resp)
        })
      })
      .catch(err => {
        return Promise.reject(err)
      })
      .finally(() => {
        runInAction(() => {
          this.formLoading = false
        })
      })
  }

  @action.bound editProduct(id, data) {
    this.formLoading = true
    return requestApi
      .put('/product', { id }, data)
      .then(resp => {
        runInAction(() => {
          const index = this.list.findIndex(item => item.id === id)

          this.list[index] = {
            id,
            ...resp,
          }
        })
      })
      .catch(err => {
        return Promise.reject(err)
      })
      .finally(() => {
        runInAction(() => {
          this.formLoading = false
        })
      })
  }

  @action.bound removeProduct(value) {
    this.listLoading = true
    return requestApi
      .delete('/product', { id: value.id })
      .then(() => {
        runInAction(() => {
          this.list.remove(value)
        })
      })
      .catch(err => {
        return Promise.reject(err)
      })
      .finally(() => {
        runInAction(() => {
          this.listLoading = false
        })
      })
  }
}

export default Products
