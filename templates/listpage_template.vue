<template>
  <div>
    <v-alert v-show="show_msg" :type="msg_type">
      {{ errors }}
    </v-alert>
    <b-table :fields="column" striped hover :items="items">
      <template #cell(actions)="row">
        <b-button size="sm" variant="primary" @click="editStore(row.item.id)"> Editar </b-button>
        <b-button size="sm" variant="danger" @click="deletarStore(row.item.id, row.index)"> Deletar </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapState } from "vuex";
import ApiService from "@/core/services/api.service";
export default {
  name: "User",
  data() {
    return {
      column: [
        {{ObjectColsInputs}}
      ],
      errors: [],
      show_msg: false,
      msg_type: null,
      items: null,
    };
  },
  mounted() {
    ApiService.get("{{Object}}/get")
      .then(({ data }) => {
        this.items = data.{{object}};
      })
      .catch(({ response }) => {
        this.errors = response.data.errors;
        this.msg_type = "error";
        this.show_msg = true;
      });
  },
  computed: {

  },
  methods: {
    editStore(id) {
      this.$router.push('/{{Object}}/edit/'+ id);
    },
    deletarStore(id, index) {

      ApiService.post("{{Object}}/delete", {
        id: id ,
      })
        .then(({ data }) => {
          this.errors = data.message;
          this.show_msg = true;
          this.msg_type = "success";
          this.items.splice(index,1);
        })
        .catch(({ response }) => {
          this.errors = response.data.errors;
          this.msg_type = "error";
          this.show_msg = true;
        });
    },
  },
  components: {},
};
</script>
