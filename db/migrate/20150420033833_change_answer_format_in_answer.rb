class ChangeAnswerFormatInAnswer < ActiveRecord::Migration
  def change
    change_column :answers, :answer, :text
  end
end
