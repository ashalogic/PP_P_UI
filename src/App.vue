<script setup lang="ts">
import { supabase } from './lib/supabaseClient'

import { ref, onMounted, watch } from 'vue'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

interface Plate {
  id: string
  created_at: string
  plate_number: string
}

interface Validation_struct {
  error: boolean
  color: string
  message: string
}

const validation_message = ref<Validation_struct>()

const plates = ref<[Plate]>()
const selectedPlate = ref<Plate>()

const input_plate = ref<string>('')
const DE_Plate = new RegExp(`^[a-zA-Z]{1,3}-[a-zA-Z]{1,2} {1,4}`)

watch(input_plate, async (n_input_plate, o_input_plate) => {
  if (!DE_Plate.test(n_input_plate)) {
    validation_message.value = { color: 'danger', error: true, message: 'not valid' }
  } else {
    validation_message.value = undefined
  }
})

async function getPlates() {
  const data = await supabase.from('plates').select()
  plates.value = data.data?.sort((x, y) => (x.id, y.id)) as [Plate]
}
async function addPlate() {
  if (input_plate.value != '' && !validation_message.value?.error) {
    const { data, error } = await supabase
      .from('plates')
      .insert([{ plate_number: input_plate.value.toUpperCase() }])
      .select()
    getPlates()
  }
}
async function deletePlate(_plate: Plate) {
  const { error } = await supabase.from('plates').delete().eq('id', _plate.id)
  getPlates()
}
async function updatePlate(_plate: Plate) {
  if (input_plate.value != '' && !validation_message.value?.error) {
    const { data, error } = await supabase
      .from('plates')
      .update([{ plate_number: input_plate.value.toUpperCase() }])
      .eq('id', _plate.id)
    getPlates()
  }
}

onMounted(() => {
  getPlates()
})
</script>

<template>
  <div class="container">
    <div class="row mt-4">
      <div class="col-md-8 mx-auto">
        <div class="d-flex flex-column">
          <h1>CRNV v1</h1>
          <br />
          <label for="plate_number" class="form-label">EX: B-AB 123</label>
          <div class="mb-3">
            <div class="d-flex flex-row justify-content-between gap-3">
              <form class="form-floating flex-grow-1">
                <input
                  v-model="input_plate"
                  type="text"
                  class="form-control form-control-lg"
                  :class="[
                    input_plate != '' ? (validation_message?.error ? 'is-invalid' : 'is-valid') : ''
                  ]"
                  id="plate_number"
                  placeholder="B-AB 123"
                />
                <label for="floatingInputInvalid">Plate Number</label>
              </form>

              <button class="btn btn-success text-white white-text" @click="addPlate()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
                  <path
                    d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm7.25-3.25v2.5h2.5a.75.75 0 0 1 0 1.5h-2.5v2.5a.75.75 0 0 1-1.5 0v-2.5h-2.5a.75.75 0 0 1 0-1.5h2.5v-2.5a.75.75 0 0 1 1.5 0Z"
                  ></path>
                </svg>
                <span class="ms-2">Add</span>
              </button>
            </div>
            <p class="ms-2 mt-2" v-if="validation_message?.error === true">
              {{ validation_message.message }}
            </p>
          </div>
          <hr />
          <table class="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Created at</th>
                <th scope="col">Number Plate</th>
              </tr>
            </thead>
            <tbody class="table-group-divider">
              <tr
                v-for="plate in plates"
                :key="plate.id"
                @click="
                  () => {
                    selectedPlate = plate
                    input_plate = plate.plate_number
                  }
                "
                :class="{ 'table-active': selectedPlate?.id === plate.id }"
              >
                <th scope="row">{{ plate.id }}</th>
                <td>{{ new Date(plate.created_at).toDateString() }}</td>
                <td>{{ plate.plate_number }}</td>
                <td>
                  <div class="btn-group" role="group" aria-label="First group">
                    <button
                      type="button"
                      class="btn btn-danger text-white"
                      @click="deletePlate(plate)"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M11 1.75V3h2.25a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1 0-1.5H5V1.75C5 .784 5.784 0 6.75 0h2.5C10.216 0 11 .784 11 1.75ZM4.496 6.675l.66 6.6a.25.25 0 0 0 .249.225h5.19a.25.25 0 0 0 .249-.225l.66-6.6a.75.75 0 0 1 1.492.149l-.66 6.6A1.748 1.748 0 0 1 10.595 15h-5.19a1.75 1.75 0 0 1-1.741-1.575l-.66-6.6a.75.75 0 1 1 1.492-.15ZM6.5 1.75V3h3V1.75a.25.25 0 0 0-.25-.25h-2.5a.25.25 0 0 0-.25.25Z"
                        ></path>
                      </svg>
                    </button>
                    <button type="button" class="btn btn-warning" @click="updatePlate(plate)">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                      >
                        <path
                          d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758l8.61-8.61Zm.176 4.823L9.75 4.81l-6.286 6.287a.253.253 0 0 0-.064.108l-.558 1.953 1.953-.558a.253.253 0 0 0 .108-.064Zm1.238-3.763a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354Z"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              <h1 v-if="plates?.length! <= 0" class="text-center">No Data</h1>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
