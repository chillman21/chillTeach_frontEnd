<template>
  <div class="app-container">
    <el-input v-model="filterText" placeholder="请输入关键字" style="margin-bottom:30px;" />

    <el-tree
      ref="tree2"
      :data="data2"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />
  </div>
</template>
<script>
import subject from "@/api/edu/subject";
export default {
  data() {
    return {
      filterText: "",
      data2: [], //返回的所有分类
      defaultProps: {
        children: "children",
        label: "title"
      }
    };
  },
  created() {
      this.getAllSubject()
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val);
    }
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
    getAllSubject() {
      subject.getAllSubject().then(response => {
        this.data2 = response.data.list;
      });
    }
  }
};
</script>