<template>
  <div class="tab-container">
    <el-tabs style='margin-top:15px;' v-model="activeName">
      <el-tab-pane v-for="item in tabMapOptions" :label="item.name" :key='item.id' :name="item.code">
        <keep-alive>
          <search-pane v-if='activeName=="search"'></search-pane>
          <tab-pane v-else-if='activeName==item.code' :type='item.id'></tab-pane>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabPane from './components/groupDetail';
import searchPane from './components/groupSearch';
import {
  getAllGroupTypes
} from 'api/admin/group/group';
export default {
  name: 'group',
  components: {
    tabPane,
    searchPane
  },
  data() {
    return {
      tabMapOptions: [
      ],
      activeName: 'role'
    }
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getAllGroupTypes().then(data => {
        this.tabMapOptions = data;
      });
    }
  }
}
</script>

<style slot-scope>
.tab-container {
  margin: 30px;
}
</style>
