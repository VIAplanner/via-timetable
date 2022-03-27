<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <template>
        <v-row no-gutters>
          <v-col cols="1" class="assessment-item">
            {{ assessment.grade ? assessment.grade : '--' }}
          </v-col>
          <v-col cols="7" class="assessment-item">
            {{ assessment.type }}: {{ assessment.description }}
          </v-col>
          <v-col cols="1" class="text--secondary assessment-item">
            <v-fade-transition leave-absolute>
              <span>
                {{ assessment.weight }}
              </span>
            </v-fade-transition>
          </v-col>
          <v-col cols="2" class="text--secondary assessment-item">
            <v-fade-transition leave-absolute>
              <span>
                {{
                  assessment.deadline
                    ? assessment.deadline
                    : assessment.on_going
                    ? 'On-going'
                    : 'TBD'
                }}
              </span>
            </v-fade-transition>
          </v-col>
          <v-col cols="1">
            <v-fade-transition leave-absolute>
              <span>
                <v-btn icon>
                  <v-icon class="mr-1"> mdi-square-edit-outline </v-icon>
                </v-btn>
                <v-btn icon @click="deleteAssessment">
                  <v-icon class="mr-1"> mdi-delete </v-icon>
                </v-btn>
              </span>
            </v-fade-transition>
          </v-col>
        </v-row>
      </template>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row align="center">
        <v-checkbox
          v-model="defaultTodo"
          hide-details
          class="shrink mt-0"
        ></v-checkbox>
        <v-text-field
          label="Enter your to-dos"
          v-on:keyup.enter="addTodo"
          v-model="newTodo"
        ></v-text-field>
      </v-row>
      <v-checkbox
        v-for="(todo, i) in todos"
        v-model="todo.done"
        :key="i"
        class="shrink mr-2 mt-0"
        hide-details
        style="align-items: center"
        append-icon="mdi-delete"
        @click:append="removeTodo(i)"
      >
        <template v-slot:label>
          <v-row align="center">
            <v-col cols="9">
              <span
                :class="{
                  'checkbox-marked': todo.done,
                }"
                >{{ todo.description }}
              </span>
            </v-col>
            <v-col cols="2">
              <v-menu
                v-model="todo.dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="todo.deadline"
                    label="Deadline"
                    prepend-icon="mdi-calendar"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    :disabled=todo.done
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="todo.deadline"
                  @input="todo.dateMenu = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
          </v-row>
        </template>
      </v-checkbox>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>

export default {
  props: {
    assessment: Object,
    index: Number,
  },
  created() {
    window.addEventListener('resize', this.handleResize);
  },
  data() {
    return {
      height: window.innerHeight,
      defaultTodo: false,
      todos: this.$props.assessment.subtasks,
      newTodo: '',
    };
  },
  methods: {
    handleResize() {
      this.height = window.innerHeight;
    },
    addTodo() {
      if (this.newTodo === '') {
        return;
      }
      const todo = {
        description: this.newTodo,
        deadline: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10),
        done: false,
      };
      this.todos.push({
        ...todo,
        dateMenu: false,
        editMenu: false,
      });
      this.newTodo = '';
    },
    removeTodo(i) {
      this.todos.splice(i, 1);
    },
    // editAssessment(e) {
    //   e.stopPropagation();
    //   this.$store.commit('editAssessment', this.index)
    // },
    deleteAssessment(e) {
      e.stopPropagation();
      this.$store.commit('deleteAssessment', {
        index: this.index,
        courseCode: this.$route.params.id,
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.assessment-item {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.checkbox-marked {
  text-decoration: line-through;
}
.row {
  margin: 0;
  justify-content: space-between;
}
</style>