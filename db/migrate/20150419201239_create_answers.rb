class CreateAnswers < ActiveRecord::Migration
  def change
    create_table :answers do |t|
      t.integer :person_id
      t.integer :question_id
      t.string :answer
      t.datetime :start_time
      t.datetime :end_time

      t.timestamps null: false
    end
  end
end
