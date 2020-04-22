require('dotenv').config();
import MediatorFuncs from './Mediator';

if(!process.env.TOKEN) throw new Error('Invalid token');

const Mediator = MediatorFuncs(process.env.TOKEN);

if(process.env.CONTACT) Mediator.SendMessage(process.env.CONTACT, 'Hi leonardo, wellcome...');

Mediator.ObservableMessages(process.env.CONTACT);