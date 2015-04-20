class Person < ActiveRecord::Base
  has_many :answers

  def add_valuation!(valuation)
    self.valuation = valuation
    self.save!
  end
end
