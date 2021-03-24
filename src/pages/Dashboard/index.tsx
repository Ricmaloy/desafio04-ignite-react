import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodData {
  id: number
  name: string
  description: string
  price: number
  available: boolean
  image: string
}

function Dashboard(){
  const [foods, setFoods] = useState<FoodData[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodData>();
  
  useEffect(() => {
    async function loadFoods() {
      await api.get('/foods').then(response => response.data).then(data => setFoods(data));
    }

    loadFoods();
  },[]);
  
  async function handleAddFood(food: FoodData) {
    	try {
      await api.post('/foods', {
        ...food,
        available: true,
      }).then(response => setFoods([...foods, response.data]));

    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: FoodData) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood?.id}`,{ 
        ...editingFood, 
        ...food 
      });

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch(error) {
      console.log(error);
    }
  }

  async function handleDeleteFood(id: number) {
    try {
      await api.delete(`/foods/${id}`);

      const foodsFiltered = foods.filter(food => food.id !== id);
  
      setFoods(foodsFiltered);
    } catch(error) {
      console.log(error);
    }
  }

  function toggleModal() {
    setIsModalOpen(!isModalOpen);
  }

  function toggleEditModal() {
    setIsEditModalOpen(!isEditModalOpen);
  }

  function handleEditFood(food: FoodData) {
    setIsEditModalOpen(!isEditModalOpen);
    setEditingFood(food);
  }

  return (
    <>
         <Header openModal={toggleModal} />
         <ModalAddFood
          isOpen={isModalOpen}
          setIsOpen={toggleModal}
          handleAddFood={handleAddFood}
        />
        <ModalEditFood
          isOpen={isEditModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={editingFood}
          handleUpdateFood={handleUpdateFood}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                food={food}
                handleDelete={handleDeleteFood}
                handleEditFood={handleEditFood}
              />
            ))}
        </FoodsContainer>
      </>
  )
}

export default Dashboard;