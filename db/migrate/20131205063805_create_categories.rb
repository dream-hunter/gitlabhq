class CreateCategories < ActiveRecord::Migration
  def change
    create_table :categories do |t|
    	t.string :name
    	t.string :usage
    	t.string :icon
      t.timestamps
    end
    add_index :categories, :name
  end
end