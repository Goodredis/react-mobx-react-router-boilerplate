import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { Modal } from 'antd'
import ProductForm from '../ProductForm'

@inject(({ products }) => ({
  formLoading: products.formLoading,
  addProduct: products.addProduct,
  editProduct: products.editProduct,
}))
@observer
class FormModal extends React.Component {
  constructor(props) {
    super(props)

    this.formRef = React.createRef()
  }

  handleOk = () => {
    const { addProduct, editProduct, onClose, data } = this.props

    this.formRef.current.validateFields((err, values) => {
      if (!err) {
        const postData = {
          ...values,
          productionDate: values.productionDate.format('YYYY-MM-DD'),
        }

        if (this.isEdit()) {
          editProduct(data.id, postData).finally(() => {
            onClose()
          })
        } else {
          addProduct(postData).finally(() => {
            onClose()
          })
        }
      }
    })
  }

  handleCancel = () => {
    this.props.onClose()
  }

  isEdit = () => {
    const { data } = this.props

    return Object.keys(data).length !== 0
  }

  render() {
    const { visible, formLoading, data } = this.props

    return (
      <Modal
        title={this.isEdit() ? '编辑产品' : '创建产品'}
        visible={visible}
        confirmLoading={formLoading}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <ProductForm data={data} ref={this.formRef} />
      </Modal>
    )
  }
}

FormModal.wrappedComponent.propTypes = {
  formLoading: PropTypes.bool.isRequired,
  addProduct: PropTypes.func.isRequired,
  editProduct: PropTypes.func.isRequired,
}

FormModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
}

export default FormModal
