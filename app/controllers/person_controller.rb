class PersonController < ApplicationController
  skip_before_filter :verify_authenticity_token

  def find_or_create
    person = Person.find_or_create_by(email: params['email'])
    person.name = params['name']
    if person.treatment.nil?
      person.treatment = rand(2)
    end
    person.save!

    render json: { success: true, person: person }
  rescue StandardError => e
    render json: { success: false }
  end

  def update_valuation
    Person.find(params['id']).add_valuation!(params['valuation'])

    render json: { success: true }
  rescue StandardError => e
    render json: { success: false }
  end
end