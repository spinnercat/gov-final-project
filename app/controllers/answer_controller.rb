class AnswerController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def create
    answer = Answer.new
    answer.person_id = params['person_id']
    answer.question_id = params['question_id']
    answer.answer = params['answer']
    answer.start_time = params['start_time']
    answer.end_time = params['end_time']
    answer.save!

    render json: { success: true }
  rescue StandardError => e
    render json: { success: false }
  end
end