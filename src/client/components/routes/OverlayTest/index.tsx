import React from 'react'
import style from './style.scss'
import { PropsFromRedux } from './Connected'

const OverlayTest = (props: PropsFromRedux) => (
  <div>
    <button className={style['button']} onClick={props.showOverlay}>Show overlay</button>
    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Deserunt commodi et, inventore sint molestiae aliquam autem iusto. Reprehenderit, quas ipsa quisquam quaerat porro similique qui, iure, et amet eveniet dicta!</p>
    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Harum, asperiores rem consequatur cupiditate dolore nostrum aliquam voluptas inventore magni delectus neque necessitatibus perspiciatis expedita, tempora voluptates reiciendis deleniti earum quisquam!</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusamus nisi aperiam praesentium voluptatem dolor assumenda ad tempore mollitia corrupti fugit temporibus, error asperiores aut enim repellendus dolorum voluptatum ea nesciunt!</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sapiente blanditiis, commodi ex quo saepe corporis iure doloribus eum error impedit quasi non excepturi consectetur laborum qui nam tempora soluta cupiditate!</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat aspernatur ex optio, asperiores at ipsa, delectus accusantium omnis velit facere quaerat soluta eos aliquam, voluptas accusamus veritatis vel vero earum.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim, rem autem sapiente fugit cum quam soluta, excepturi voluptatem, fuga delectus laborum obcaecati velit odit perspiciatis dolorem. Culpa praesentium commodi distinctio.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod possimus eveniet excepturi, amet esse a nesciunt pariatur quibusdam aliquid saepe facere veniam aliquam placeat similique inventore totam quisquam. Error, incidunt!</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero quod, at ea quis nesciunt itaque quas vitae. Et odio sint rem, eligendi quisquam facere ab quod nulla officia maxime. Tempora?</p>
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Iste nisi sequi eum explicabo ipsa, pariatur facere provident repellendus, culpa possimus quibusdam delectus hic tempora dolore commodi temporibus architecto eos blanditiis.</p>
    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum id fugit et blanditiis expedita? Dignissimos quis neque sint ex eligendi, quae eius vitae, quaerat, eaque consequatur laborum! Nesciunt, animi tempora.</p>
    <button className={style['button']} onClick={props.showOverlay}>Show overlay</button>
  </div>
)

export default OverlayTest